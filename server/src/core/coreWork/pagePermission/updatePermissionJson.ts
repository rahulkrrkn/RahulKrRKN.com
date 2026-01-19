import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getAuthRolePermissionFUIConn } from "../../coreWork/auth_role_permissions.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const PERMISSION_FILE = path.join(__dirname, "permission.json");

export const CACHE_EXPIRE_MS = 10 * 60 * 1000; // 10 min

export type PermissionCacheFile = {
  permissions: any[];
  date: string;
  expiryAt: string;
  version: string;
};

function readPermissionFile(): PermissionCacheFile | null {
  try {
    if (!fs.existsSync(PERMISSION_FILE)) return null;

    const raw = fs.readFileSync(PERMISSION_FILE, "utf-8");
    if (!raw.trim()) return null;

    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writePermissionFile(data: PermissionCacheFile) {
  fs.writeFileSync(PERMISSION_FILE, JSON.stringify(data, null, 2), "utf-8");
}

function isExpired(expiryAt?: string) {
  if (!expiryAt) return true;
  return new Date(expiryAt).getTime() <= Date.now();
}

/**
 * Ensures permission.json exists and is fresh.
 * If expired or missing => updates it from DB and returns latest data.
 */
export const updatePermissionJson = async (): Promise<PermissionCacheFile> => {
  const RolePerm = await getAuthRolePermissionFUIConn();

  let permissionRawData = readPermissionFile();

  if (!permissionRawData || isExpired(permissionRawData.expiryAt)) {
    const projectData = await RolePerm.find({}).lean();

    const newPermission: PermissionCacheFile = {
      permissions: projectData,
      date: new Date().toISOString(),
      expiryAt: new Date(Date.now() + CACHE_EXPIRE_MS).toISOString(),
      version: "1.0.0",
    };

    writePermissionFile(newPermission);
    permissionRawData = newPermission;
  }

  return permissionRawData;
};
