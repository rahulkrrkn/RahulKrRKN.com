// auth_user_fui.mdl.ts

import { getDbConn, DB_KEYS } from "../../core/lib/database/";
import { AuthUserSchema } from "../../core/schemas/auth/";

export async function getAuthUserFUIModel() {
  const conn = await getDbConn(DB_KEYS.AUTH_ALL_FUI);

  return conn.models.AuthUser || conn.model("AuthUser", AuthUserSchema);
}
