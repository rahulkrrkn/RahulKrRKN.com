import type { Connection, Model, InferSchemaType } from "mongoose";
import { AuthRolePermissionsSchema } from "../../schemas/auth/auth_role_permissions.schema.js";

export type AuthRolePermissionsDoc = InferSchemaType<
  typeof AuthRolePermissionsSchema
>;

export function auth_RolePermissionsModel(
  conn: Connection,
): Model<AuthRolePermissionsDoc> {
  return (
    conn.models.AuthRolePermissions ||
    conn.model<AuthRolePermissionsDoc>(
      "AuthRolePermissions",
      AuthRolePermissionsSchema,
    )
  );
}
