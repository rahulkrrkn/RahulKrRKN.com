import type { Connection, Model, InferSchemaType } from "mongoose";
import { AuthUserAccessSchema } from "../../schemas/auth/auth_user_access.schema.js";

export type AuthUserAccessDoc = InferSchemaType<typeof AuthUserAccessSchema>;

export function auth_UserAccessModel(
  conn: Connection,
): Model<AuthUserAccessDoc> {
  return (
    conn.models.AuthUserAccess ||
    conn.model<AuthUserAccessDoc>("AuthUserAccess", AuthUserAccessSchema)
  );
}
