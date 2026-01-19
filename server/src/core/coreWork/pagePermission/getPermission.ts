import { updatePermissionJson } from "./updatePermissionJson.js";

export const getPermission = async () => {
  const permissionRawData = await updatePermissionJson();

  if (!permissionRawData?.permissions?.length) {
    return {
      ok: false as const,
      code: "NO_PERMISSION_DATA",
      message: "No permission data found in cache or DB",
    };
  }

  return {
    ok: true as const,
    data: permissionRawData.permissions,
  };
};
