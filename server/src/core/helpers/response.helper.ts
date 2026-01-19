import type { Response } from "express";
import type { CookieOptions } from "express";

/* =======================
   Common Types
======================= */

interface SuccessOptions {
  status?: number;
  code?: string;
  [key: string]: unknown;
}

interface ErrorOptions {
  status?: number;
  code?: string;
  details?: unknown;
  [key: string]: unknown;
}

/* =======================
   Send Success Response
======================= */

export function sendSuccess(
  res: Response,
  message: string,
  data: unknown = {},
  optional: SuccessOptions = {},
) {
  const { status = 200, code = "", ...extraFields } = optional;

  let responsePayload: Record<string, unknown> = {
    statusCode: status,
    status: "success",
    code,
    message,
    data,
    error: null,
    ...extraFields,
  };

  if (res.locals?.publicData) {
    responsePayload = {
      ...responsePayload,
      ...res.locals.publicData,
    };
  }

  return res.status(status).json(responsePayload);
}

/* =======================
   Send Error Response
======================= */

export function sendError(
  res: Response,
  message: string,
  optional: ErrorOptions = {},
) {
  const { status = 500, code = "", details = {}, ...extraFields } = optional;

  let responsePayload: Record<string, unknown> = {
    statusCode: status,
    status: "error",
    code,
    message,
    data: null,
    error: details,
    ...extraFields,
  };

  if (res.locals?.publicData) {
    responsePayload = {
      ...responsePayload,
      ...res.locals.publicData,
    };
  }

  return res.status(status).json(responsePayload);
}

/* =======================
   Send Cookie
======================= */

export function sendCookie(
  res: Response,
  nameOfCookie: string,
  data: unknown,
  validityInHr: number,
  extraOptions: CookieOptions = {},
) {
  const isDev = process.env.NODE_ENV === "development";

  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: !isDev,
    sameSite: isDev ? "lax" : "none",
    path: "/",
    maxAge: validityInHr * 60 * 60 * 1000,
    ...extraOptions,
  };

  // if (!isDev) {
  //   cookieOptions.domain = "rahulkrrkn.com";
  // }

  res.cookie(nameOfCookie, data as string, cookieOptions);
}

/* =======================
   Clear Cookie
======================= */

export function clearCookie(
  res: Response,
  nameOfCookie: string,
  extraOptions: CookieOptions = {},
) {
  const isDev = process.env.NODE_ENV === "development";

  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: !isDev,
    sameSite: isDev ? "lax" : "none",
    path: "/",
    ...extraOptions,
  };

  if (!isDev) {
    cookieOptions.domain = ".cartify.rahulkrrkn.com";
  }

  res.clearCookie(nameOfCookie, cookieOptions);
}

/* =======================
   Attach Public Data
======================= */

export const sendData = (
  res: Response,
  data: Record<string, unknown>,
): void => {
  if (!res || typeof res !== "object") {
    throw new Error("Response object is required");
  }

  if (!data || typeof data !== "object") {
    throw new Error("Data must be an object");
  }

  res.locals.publicData = {
    ...(res.locals.publicData ?? {}),
    ...data,
  };
};
