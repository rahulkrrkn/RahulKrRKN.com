// auth_user_find.mdl.ts;
import { getDbConn, DB_KEYS } from "../../core/lib/database/index.js";
import { auth_RefreshSessionModel } from "../../core/models/index.js";

export async function getAuthRefreshSessionFindConn() {
  const conn = await getDbConn(DB_KEYS.AUTH_ALL_F);

  return auth_RefreshSessionModel(conn);
}

export async function getAuthRefreshSessionFUIConn() {
  const conn = await getDbConn(DB_KEYS.AUTH_ALL_FUI);

  return auth_RefreshSessionModel(conn);
}
