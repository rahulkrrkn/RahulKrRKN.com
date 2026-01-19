import type { Connection, Model, InferSchemaType } from "mongoose";
import { GeclNoticeSchema } from "../../schemas/gecl/gecl_notice.schema.js";

// Auto type from schema (no manual duplicate type)
export type GeclNoticeDoc = InferSchemaType<typeof GeclNoticeSchema>;

export function gecl_NoticeModel(conn: Connection): Model<GeclNoticeDoc> {
  return (
    conn.models.GeclNotice ||
    conn.model<GeclNoticeDoc>("GeclNotice", GeclNoticeSchema)
  );
}
