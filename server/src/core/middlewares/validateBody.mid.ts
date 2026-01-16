import type { RequestHandler } from "express";
import type { ZodSchema } from "zod";

import { ValidationError } from "../errors/ValidationError.err.js";
import { formatZodError } from "../errors/zodFormatter.err.js";

export const validateBody =
  <T>(schema: ZodSchema<T>): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(new ValidationError(formatZodError(result.error)));
    }

    req.body = result.data; // overwrite with clean data
    next();
  };
