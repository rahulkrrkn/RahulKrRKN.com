// mongoRegistry.lib.ts;
import type { Connection } from "mongoose";

export type MongoConnMeta = {
  uri: string;
  conn?: Connection;
};

export const mongoRegistry: Record<string, MongoConnMeta> = {};
