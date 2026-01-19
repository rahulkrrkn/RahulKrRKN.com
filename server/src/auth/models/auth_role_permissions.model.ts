// auth_user_find.mdl.ts;
import { getDbConn, DB_KEYS } from "../../core/lib/database/index.js";
import { auth_RolePermissionsModel } from "../../core/models/index.js";

export async function getAuthRolePermissionFUIConn() {
  const conn = await getDbConn(DB_KEYS.AUTH_ALL_FUI);

  return auth_RolePermissionsModel(conn);
}
