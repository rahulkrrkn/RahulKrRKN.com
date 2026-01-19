import type { Request } from "express";
import type { Redis } from "ioredis";
import jwt from "jsonwebtoken";

import { getPermission } from "./../coreWork/pagePermission/getPermission.js";
import { getRedis } from "./../config/redis.config.js";
import { verifyAccessToken } from "../helpers/jwt.helper.js";

const redis: Redis = getRedis();

const keyUserAccess = (userId: string, projectKey: string) =>
  `userAccess:${userId}:project:${projectKey}`;

export type GlobalPermissionResult =
  | { ok: true }
  | { ok: false; code: string; message: string };

export type RedisProjectAccess = {
  status: "active" | "blocked";
  role: string;
  deny: string[];
  allowExtra: string[];
};

export function getBearerToken(req: Request): string | null {
  const auth = req.headers.authorization;
  if (!auth) return null;

  const [type, token] = auth.split(" ");
  if (type !== "Bearer" || !token) return null;

  return token;
}

export const globalPermissionSystem = async ({
  PROJECT_CODE,
  PAGE_CODE,
  req,
}: {
  PROJECT_CODE: string;
  PAGE_CODE: string;
  req: Request;
}): Promise<GlobalPermissionResult> => {
  // 1) get access token
  const token = getBearerToken(req);

  if (!token) {
    return { ok: false, code: "NO_AUTH", message: "Missing bearer token" };
  }

  // 2) verify access token
  let userId: string;

  try {
    const payload = verifyAccessToken(token);
    userId = payload.userId;
  } catch (err: any) {
    if (err instanceof jwt.TokenExpiredError) {
      return { ok: false, code: "ACCESS_EXPIRED", message: "Access expired" };
    }

    return { ok: false, code: "ACCESS_INVALID", message: "Invalid token" };
  }

  // 3) load redis access object
  const redisKey = keyUserAccess(userId, PROJECT_CODE);
  const redisData = await redis.get(redisKey);

  if (!redisData) {
    return {
      ok: false,
      code: "NO_USER_ACCESS",
      message: "No redis session for this project",
    };
  }

  let projectObj: RedisProjectAccess;

  try {
    projectObj = JSON.parse(redisData) as RedisProjectAccess;
  } catch {
    return {
      ok: false,
      code: "REDIS_DATA_INVALID",
      message: "Invalid redis data",
    };
  }

  // 4) project status check
  if (projectObj.status === "blocked") {
    return {
      ok: false,
      code: "PROJECT_ACCESS_BLOCKED",
      message: "User blocked for this project",
    };
  }

  // 5) deny list (block always wins)
  if (projectObj.deny?.includes(PAGE_CODE)) {
    return {
      ok: false,
      code: "DENIED_BY_OVERRIDE",
      message: "Blocked by deny list",
    };
  }

  // 6) allowExtra list (extra allow)
  if (projectObj.allowExtra?.includes(PAGE_CODE)) {
    return { ok: true };
  }

  // 7) role permission check (from cached role permissions)
  const permissionResult = await getPermission();

  if (!permissionResult.ok) {
    return {
      ok: false,
      code: permissionResult.code,
      message: permissionResult.message,
    };
  }

  const list = permissionResult.data ?? [];

  if (!list.length) {
    return {
      ok: false,
      code: "NO_PERMISSION_DATA",
      message: "No permission data found",
    };
  }

  const rolePermission = list.find(
    (item: any) =>
      item.projectSlug === PROJECT_CODE &&
      item.projectRole === projectObj.role &&
      item.projectPermissions?.includes(PAGE_CODE),
  );

  if (!rolePermission) {
    return {
      ok: false,
      code: "PERMISSION_DENIED",
      message: "Permission denied",
    };
  }

  return { ok: true };
};
