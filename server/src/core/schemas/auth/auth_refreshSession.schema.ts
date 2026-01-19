import { Schema, Types } from "mongoose";

export const AuthRefreshSessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "AuthUser",
      required: true,
      index: true,
    },
    // IMPORTANT: isolate projects
    clientId: { type: String, required: true, index: true }, // example: "rahul_blog"

    // optional device id (frontend can generate uuid)
    deviceId: { type: String, required: true, index: true },

    // store hash only
    refreshTokenHash: { type: String, required: true },

    // rotation / reuse detection
    revokedAt: { type: Date, default: null },
    replacedBySessionId: { type: Schema.Types.ObjectId, default: null },

    // session metadata (optional but useful)
    ip: { type: String, default: null },
    userAgent: { type: String, default: null },

    // expire session automatically in MongoDB
    expiresAt: { type: Date, required: true, index: true },
  },
  {
    collection: "auth_refreshSessions",
    timestamps: true,
    versionKey: false,
  },
);

AuthRefreshSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
