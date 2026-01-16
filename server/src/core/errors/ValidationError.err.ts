import { AppError } from "./AppError.err.js";

export class ValidationError extends AppError {
  constructor(details: any) {
    super("Validation failed", {
      statusCode: 400,
      code: "VALIDATION_ERROR",
      details,
    });
  }
}
