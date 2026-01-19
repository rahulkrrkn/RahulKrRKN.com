import { Types } from "mongoose";
import type { Request, Response } from "express";
import crypto from "crypto";

import { sendCookie } from "../../core/helpers/response.helper.js";
import { signAccessToken } from "../../core/helpers/jwt.helper.js";

import { getAuthUserAccessFUIConn } from "../models/auth_user_access.model.js";
import { getAuthUserFindConn } from "../models/auth_User.model.js";
import { getAuthRefreshSessionFUIConn } from "../models/auth_refreshSessions.model.js";

import { buildUserAccessCache } from "./buildUserAccessCache.service.js";

export const makeUserLogin = async ({
  userId,
  email,
  req,
  res,
  clientId = "global",
  deviceId = "unknown-device",
}: {
  userId: string;
  email: string;
  req: Request;
  res: Response;
  clientId?: string;
  deviceId?: string;
}) => {
  if (!Types.ObjectId.isValid(userId)) {
    return { ok: false, code: "INVALID_USER_ID" as const };
  }

  // ensure user exists
  const User = await getAuthUserFindConn();
  const userExists = await User.findOne({ _id: userId })
    .select("_id status")
    .lean();

  if (!userExists) return { ok: false, code: "USER_NOT_FOUND" as const };
  if (userExists.status !== "active")
    return { ok: false, code: "USER_DISABLED" as const };

  const forProjectKey = req?.validatedBody?.projectKey?.trim();
  if (!forProjectKey)
    return { ok: false, code: "PROJECT_KEY_REQUIRED" as const };
  // ensure access doc exists
  const UserAccess = await getAuthUserAccessFUIConn();
  const accessDoc = await UserAccess.findOne({ _id: userId }).lean();

  if (!accessDoc) {
    await UserAccess.create({
      _id: new Types.ObjectId(userId),
      status: "active",
      project: [],
    });
  }

  const projectAccess = accessDoc?.project?.find(
    (p) => p.projectKey === forProjectKey,
  );
  res.locals.publicData ??= {};

  res.locals.publicData.PROJECT_ACCESS = !!projectAccess;

  res.locals.publicData.PROJECT_STATUS =
    !!projectAccess && projectAccess.status === "active";

  // build redis cache
  const cacheRes = await buildUserAccessCache(userId);
  if (!cacheRes.ok) return cacheRes;

  // access token (JWT)
  const accessToken = signAccessToken({ userId, email });

  // refresh token (random opaque)
  const refreshToken = crypto.randomBytes(48).toString("hex");
  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const RefreshSession = await getAuthRefreshSessionFUIConn();

  const REFRESH_DAYS = Number(process.env.REFRESH_SESSION_EXPIRES_DAYS || 7);

  const session = await RefreshSession.create({
    userId: new Types.ObjectId(userId),
    clientId,
    deviceId,
    refreshTokenHash,
    revokedAt: null,
    replacedBySessionId: null,

    // ✅ store metadata
    ip: req.ip ?? null,
    userAgent: req.headers["user-agent"] ?? null,

    expiresAt: new Date(Date.now() + REFRESH_DAYS * 24 * 60 * 60 * 1000),
  });

  // cookie stores {sid, rt}
  sendCookie(
    res,
    "REFRESH_TOKEN",
    JSON.stringify({ sid: session._id.toString(), rt: refreshToken }),
    24 * REFRESH_DAYS,
  );

  // response data
  res.locals.publicData = res.locals.publicData || {};
  res.locals.publicData.ACCESS_TOKEN = accessToken;

  return { ok: true, code: "LOGIN_SUCCESS" as const };
};
