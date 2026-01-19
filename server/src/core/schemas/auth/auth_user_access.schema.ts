import { Schema } from "mongoose";

export const AuthUserAccessSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, ref: "User", required: true }, // userId

    project: [
      {
        projectId: {
          type: Schema.Types.ObjectId,
          ref: "Project",
          required: true,
        },
        projectKey: {
          type: String,
          required: true,
          trim: true,
          lowercase: true,
        },
        status: {
          type: String,
          enum: ["active", "blocked"],
          default: "active",
        },
        role: { type: String, required: true },
        deny: [{ type: String, default: [] }],
        allowExtra: [{ type: String, default: [] }],
      },
    ],

    status: { type: String, enum: ["active", "blocked"], default: "active" },
  },
  { collection: "auth_user_access", timestamps: true, versionKey: false },
);
