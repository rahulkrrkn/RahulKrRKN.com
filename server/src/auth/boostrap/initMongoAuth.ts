// initMongo.ts;

import { buildMongoUrl } from "../../core/lib/database/mongoUrlBuilder.lib.js";
import { initDbConn } from "../../core/lib/database/initDbConn.lib.js";
import { DB_CONN_KEYS } from "../../core/lib/database/dbConnectionKeys.js";

export async function initMongoAuth() {
  const authFReadUri = buildMongoUrl({
    user: process.env.MONGO_AUTH_ALL_F!,
    pass: process.env.MONGO_AUTH_ALL_F_PASS!,
    db: "auth_db",
    appName: "auth-read-service",
  });

  const authFuiWriteUri = buildMongoUrl({
    user: process.env.MONGO_AUTH_ALL_FUI!,
    pass: process.env.MONGO_AUTH_ALL_FUI_PASS!,
    db: "auth_db",
    appName: "auth-write-service",
  });

  await Promise.all([
    initDbConn(DB_CONN_KEYS.AUTH_ALL_F, authFReadUri),
    initDbConn(DB_CONN_KEYS.AUTH_ALL_FUI, authFuiWriteUri),
  ]);
}
