// models/auth_user_find.mdl.ts

import { getDbConn, DB_KEYS } from "../../core/lib/database/";
import { AuthUserSchema } from "../../core/schemas/auth/";

export async function getAuthUserFindModel() {
  const conn = await getDbConn(DB_KEYS.AUTH_ALL_F);

  return conn.models.AuthUser || conn.model("AuthUser", AuthUserSchema);
}
