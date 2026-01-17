import type { Connection, Model, InferSchemaType } from "mongoose";
import { AuthUserSchema } from "../../schemas/auth/auth_user.schema.js";

export type AuthUserDoc = InferSchemaType<typeof AuthUserSchema>;

export function auth_UserModel(conn: Connection): Model<AuthUserDoc> {
  return (
    conn.models.AuthUser || conn.model<AuthUserDoc>("AuthUser", AuthUserSchema)
  );
}
