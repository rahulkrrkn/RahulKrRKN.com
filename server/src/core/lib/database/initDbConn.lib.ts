// initDbConn.lib.ts;
import mongoose from "mongoose";
import { mongoRegistry } from "./mongoRegistry.lib.js";

export async function initDbConn(key: string, uri: string) {
  const entry = mongoRegistry[key];

  // reuse healthy connection
  if (entry?.conn && entry.conn.readyState === 1) {
    return entry.conn;
  }

  const conn = mongoose.createConnection(uri, {
    maxPoolSize: 10,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  conn.on("connected", () => console.log(`✅ Mongo connected → ${key}`));
  conn.on("disconnected", () => console.warn(`❌ Mongo disconnected → ${key}`));
  conn.on("error", (err) => console.error(`❌ Mongo error → ${key}`, err));

  await conn.asPromise();

  mongoRegistry[key] = { uri, conn };

  return conn;
}
