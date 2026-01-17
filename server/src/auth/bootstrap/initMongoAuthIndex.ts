import { getAuthRefreshSessionFUIConn } from "../models/auth_refreshSessions.model.js";
import { getAuthUserFUIConn } from "../models/auth_User.model.js";

export async function initMongoAuthIndexes() {
  const UserFui = await getAuthUserFUIConn();
  await UserFui.syncIndexes();

  // const RefreshSessionFui = await getAuthRefreshSessionFUIConn();
  // await RefreshSessionFui.syncIndexes();
}

// Not allowed
// const UserFind = await getAuthUserFindModel();
// await UserFind.syncIndexes();
