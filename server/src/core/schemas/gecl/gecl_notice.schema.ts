import { Schema, Types, model } from "mongoose";

const NoticeCategoryEnum = [
  "exam",
  "class",
  "event",
  "placement",
  "fee",
  "general",
] as const;

const NoticeVisibilityEnum = ["public", "private"] as const;

const NoticePriorityEnum = ["low", "normal", "high", "urgent"] as const;

const NoticeStatusEnum = [
  "draft",
  "scheduled",
  "published",
  "archived",
  "deleted",
] as const;

const AttachmentTypeEnum = ["pdf", "image", "doc"] as const;

const PushProviderEnum = ["fcm", "onesignal"] as const; // optional for future

export const GeclNoticeSchema = new Schema(
  {
    projectId: { type: Types.ObjectId, required: true, index: true },

    createdBy: { type: Types.ObjectId, required: true, ref: "auth_users" },

    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },

    category: {
      type: String,
      enum: NoticeCategoryEnum,
      default: "general",
      index: true,
    },

    visibility: {
      type: String,
      enum: NoticeVisibilityEnum,
      default: "private",
      index: true,
    },

    priority: {
      type: String,
      enum: NoticePriorityEnum,
      default: "normal",
      index: true,
    },

    pinned: { type: Boolean, default: false, index: true },

    status: {
      type: String,
      enum: NoticeStatusEnum,
      default: "draft",
      index: true,
    },

    publishAt: { type: Date, default: null, index: true },
    expiresAt: { type: Date, default: null, index: true },

    target: {
      roles: { type: [String], default: [] }, // ["student","teacher","hod","admin"]
      departments: { type: [String], default: [] }, // ["CSE","ECE"]
      semesters: { type: [Number], default: [] }, // [1..8]
      batches: { type: [String], default: [] }, // ["2024-2028"]
    },

    channels: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: false },
    },

    emailSubject: { type: String, default: null },
    emailBody: { type: String, default: null },

    smsBody: { type: String, default: null },

    pushTitle: { type: String, default: null },
    pushBody: { type: String, default: null },

    pushImageUrl: { type: String, default: null },
    pushIconUrl: { type: String, default: null },

    clickActionUrl: { type: String, default: null },

    attachments: [
      {
        fileName: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String, enum: AttachmentTypeEnum, default: "pdf" },
      },
    ],

    stats: {
      totalRead: { type: Number, default: 0 },
    },

    // optional future (if you want)
    pushProvider: {
      type: String,
      enum: PushProviderEnum,
      default: "fcm",
    },
  },
  {
    collection: "gecl_notices",
    timestamps: true,
    versionKey: false,
  },
);

GeclNoticeSchema.index({ projectId: 1, status: 1, pinned: -1, createdAt: -1 });
GeclNoticeSchema.index({ projectId: 1, category: 1, createdAt: -1 });
