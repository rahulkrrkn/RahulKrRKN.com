export class AppError extends Error {
  statusCode: number;
  code: string;
  details?: any;

  constructor(
    message: string,
    opts?: { statusCode?: number; code?: string; details?: any }
  ) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = opts?.statusCode ?? 500;
    this.code = opts?.code ?? "INTERNAL_ERROR";
    this.details = opts?.details;

    Error.captureStackTrace(this, this.constructor);
  }
}
