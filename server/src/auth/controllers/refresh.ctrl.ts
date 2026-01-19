import type { Request, Response } from "express";
import crypto from "crypto";
import { Types } from "mongoose";

import { sendCookie } from "../../core/helpers/response.helper.js";
import { sendError, sendSuccess } from "../../core/helpers/response.helper.js";

import { getAuthUserFindConn } from "../models/auth_User.model.js";
import { getAuthRefreshSessionFUIConn } from "../models/auth_refreshSessions.model.js";

import { signAccessToken } from "../../core/helpers/jwt.helper.js";
import { buildUserAccessCache } from "../services/buildUserAccessCache.service.js";

export const refreshAccessToken = async (req: Request, res: Response) => {
  const raw = req.cookies?.REFRESH_TOKEN;

  if (!raw) {
    return sendError(res, "No refresh token", {
      status: 401,
      code: "NO_REFRESH",
    });
  }

  let cookieData: { sid: string; rt: string };

  try {
    cookieData = JSON.parse(raw);
  } catch {
    return sendError(res, "Invalid refresh cookie", {
      status: 401,
      code: "REFRESH_COOKIE_INVALID",
    });
  }

  const { sid, rt } = cookieData;

  if (!sid || !rt) {
    return sendError(res, "Invalid refresh cookie data", {
      status: 401,
      code: "REFRESH_COOKIE_BAD_DATA",
    });
  }

  if (!Types.ObjectId.isValid(sid)) {
    return sendError(res, "Invalid session id", {
      status: 401,
      code: "REFRESH_SESSION_INVALID",
    });
  }

  const RefreshSession = await getAuthRefreshSessionFUIConn();
  const session = await RefreshSession.findOne({ _id: sid }).lean();

  if (!session) {
    return sendError(res, "Session not found", {
      status: 401,
      code: "REFRESH_SESSION_NOT_FOUND",
    });
  }

  if (session.revokedAt) {
    return sendError(res, "Session revoked", {
      status: 401,
      code: "REFRESH_SESSION_REVOKED",
    });
  }

  if (session.expiresAt && new Date(session.expiresAt).getTime() < Date.now()) {
    return sendError(res, "Session expired", {
      status: 401,
      code: "REFRESH_SESSION_EXPIRED",
    });
  }

  // verify refresh token hash
  const incomingHash = crypto.createHash("sha256").update(rt).digest("hex");

  if (incomingHash !== session.refreshTokenHash) {
    // revoke session to protect user
    await RefreshSession.updateOne(
      { _id: sid },
      { $set: { revokedAt: new Date() } },
    );

    return sendError(res, "Refresh token mismatch", {
      status: 401,
      code: "REFRESH_TOKEN_MISMATCH",
    });
  }

  // user check
  const User = await getAuthUserFindConn();
  const user = await User.findOne({ _id: session.userId })
    .select("email status")
    .lean();

  if (!user) {
    return sendError(res, "User not found", {
      status: 401,
      code: "USER_NOT_FOUND",
    });
  }

  if (user.status !== "active") {
    return sendError(res, "User not active", {
      status: 401,
      code: "USER_DISABLED",
    });
  }

  // build redis cache only
  await buildUserAccessCache(String(session.userId));

  // new access token
  const newAccessToken = signAccessToken({
    userId: String(session.userId),
    email: user.email,
  });

  // rotate refresh session (only 1 insert)
  const newRefreshToken = crypto.randomBytes(48).toString("hex");
  const newRefreshHash = crypto
    .createHash("sha256")
    .update(newRefreshToken)
    .digest("hex");

  const REFRESH_DAYS = Number(process.env.REFRESH_SESSION_EXPIRES_DAYS || 7);

  const newSession = await RefreshSession.create({
    userId: session.userId,
    clientId: session.clientId,
    deviceId: session.deviceId,
    refreshTokenHash: newRefreshHash,
    revokedAt: null,
    replacedBySessionId: null,
    ip: req.ip ?? null,
    userAgent: req.headers["user-agent"] ?? null,
    expiresAt: new Date(Date.now() + REFRESH_DAYS * 24 * 60 * 60 * 1000),
  });

  // revoke old session
  await RefreshSession.updateOne(
    { _id: sid },
    { $set: { revokedAt: new Date(), replacedBySessionId: newSession._id } },
  );

  // set cookie
  sendCookie(
    res,
    "REFRESH_TOKEN",
    JSON.stringify({ sid: newSession._id.toString(), rt: newRefreshToken }),
    24 * REFRESH_DAYS,
  );
  // response data
  res.locals.publicData = res.locals.publicData || {};
  res.locals.publicData.ACCESS_TOKEN = newAccessToken;

  return sendSuccess(res, "Access token refreshed", {
    ACCESS_TOKEN: newAccessToken,
  });
};
