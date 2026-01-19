import type { Connection, Model, InferSchemaType } from "mongoose";
import { AuthRefreshSessionSchema } from "../../schemas/auth/auth_refreshSession.schema.js";

// Auto type from schema (no manual duplicate type)
export type RefreshSessionDoc = InferSchemaType<
  typeof AuthRefreshSessionSchema
>;

export function auth_RefreshSessionModel(
  conn: Connection,
): Model<RefreshSessionDoc> {
  return (
    conn.models.RefreshSession ||
    conn.model<RefreshSessionDoc>("RefreshSession", AuthRefreshSessionSchema)
  );
}
