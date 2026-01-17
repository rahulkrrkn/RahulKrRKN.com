// auth_User.model.ts
import { getDbConn, DB_KEYS } from "../../core/lib/database/index.js";
import { auth_UserModel } from "../../core/models/index.js";

export async function getAuthUserFindConn() {
  const conn = await getDbConn(DB_KEYS.AUTH_ALL_F);

  // ✅ return model from factory
  return auth_UserModel(conn);
}

export async function getAuthUserFUIConn() {
  const conn = await getDbConn(DB_KEYS.AUTH_ALL_FUI);

  // ✅ return model from factory
  return auth_UserModel(conn);
}
