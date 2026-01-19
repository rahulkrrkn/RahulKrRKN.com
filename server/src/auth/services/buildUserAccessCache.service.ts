import { Types } from "mongoose";
import type { Redis } from "ioredis";

import { getRedis } from "../../core/config/redis.config.js";
import { getAuthUserAccessFUIConn } from "../models/auth_user_access.model.js";

const redis: Redis = getRedis();

const keyUserAccess = (userId: string, projectKey: string) =>
  `userAccess:${userId}:project:${projectKey}`;

export const buildUserAccessCache = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    return { ok: false, code: "INVALID_USER_ID" as const };
  }

  const UserAccess = await getAuthUserAccessFUIConn();
  const accessDoc = await UserAccess.findOne({ _id: userId }).lean();

  if (!accessDoc) {
    return { ok: false, code: "NO_ACCESS_DOC" as const };
  }

  if (accessDoc.status === "blocked") {
    return { ok: false, code: "USER_BLOCKED" as const };
  }

  const ACCESS_MIN = Number(process.env.JWT_ACCESS_EXPIRES_MIN || 15);
  const CACHE_MIN_FROM_ENV = Number(process.env.REDIS_USER_ACCESS_TTL_MIN || 0);

  // cache must be >= access + 1 min
  const CACHE_MIN = Math.max(CACHE_MIN_FROM_ENV, ACCESS_MIN + 1);
  const CACHE_SECONDS = CACHE_MIN * 60;

  for (const p of accessDoc.project ?? []) {
    const projectKey = String(p.projectKey);

    await redis.set(
      keyUserAccess(userId, projectKey),
      JSON.stringify({
        status: p.status,
        role: p.role,
        deny: p.deny ?? [],
        allowExtra: p.allowExtra ?? [],
      }),
      "EX",
      CACHE_SECONDS,
    );
  }

  return { ok: true as const };
};
