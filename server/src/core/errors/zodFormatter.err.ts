import type { ZodError } from "zod";

export function formatZodError(err: ZodError) {
  return err.issues.map((issue) => ({
    path: issue.path.length ? issue.path.join(".") : "body",
    message: issue.message,
    code: issue.code,
  }));
}
