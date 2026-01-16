import { getAuthUserFUIModel, getAuthUserFindModel } from "../models";

export async function initMongoAuthIndexes() {
  const UserFui = await getAuthUserFUIModel();
  await UserFui.syncIndexes();
}

// Not allowed
// const UserFind = await getAuthUserFindModel();
// await UserFind.syncIndexes();
