// getDbConn.lib.ts;
import { mongoRegistry } from "./mongoRegistry.lib.js";
import { initDbConn } from "./initDbConn.lib.js";
// import { DB_CONN_KEYS } from "./database/dbConnctionKeys.js";
export async function getDbConn(key: string) {
  const entry = mongoRegistry[key];

  if (!entry) {
    throw new Error(`Mongo config not registered for key: ${key}`);
  }

  if (entry.conn && entry.conn.readyState === 1) {
    return entry.conn;
  }

  // 🔁 auto-reconnect
  console.warn(`Mongo reconnecting → ${key}`);
  return initDbConn(key, entry.uri);
}
