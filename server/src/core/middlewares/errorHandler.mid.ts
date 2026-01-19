import type { ErrorRequestHandler } from "express";
import { AppError } from "../errors/AppError.err.js";

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  console.log("err", err);

  // Default fallback
  let statusCode = 500;
  let code = "INTERNAL_ERROR";
  let message = "Something went wrong";
  let details: any = null;

  // Our custom errors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
    details = err.details ?? null;
  }

  // Log internal errors only (recommended)
  if (statusCode >= 500) {
    console.error("🔥 INTERNAL ERROR:", {
      path: req.path,
      method: req.method,
      err,
    });
  }

  return res.status(statusCode).json({
    success: false,
    message,
    error: {
      code,
      details,
    },
  });
};
