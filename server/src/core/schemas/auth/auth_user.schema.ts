import { Schema, Types } from "mongoose";

export const AuthUserSchema = new Schema(
  {
    _id: { type: Types.ObjectId, auto: true },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    emailVerifiedAt: {
      type: Date,
      default: null,
    },

    roles: {
      type: [{ type: String, enum: ["user", "admin", "moderator"] }],
      default: ["user"],
    },

    status: {
      type: String,
      enum: ["active", "suspended", "deleted"],
      default: "active",
      index: true,
    },

    lastLoginAt: { type: Date, default: null },
    passwordChangedAt: { type: Date, default: null },

    deletedAt: { type: Date, default: null },
  },
  {
    collection: "users",
    timestamps: true,
    versionKey: false,
  }
);
AuthUserSchema.index({ email: 1 }, { unique: true });
