import { Schema, model } from "mongoose";

export const AuthRolePermissionsSchema = new Schema(
  {
    projectName: { type: String, required: true },
    projectSlug: { type: String, required: true },
    projectRole: { type: String, required: true },
    projectPermissions: [{ type: String, required: true }],
  },
  {
    collection: "auth_role_permissions",
    timestamps: true,
    versionKey: false,
  },
);

// ✅ unique together
AuthRolePermissionsSchema.index(
  { projectSlug: 1, projectRole: 1 },
  { unique: true },
);
