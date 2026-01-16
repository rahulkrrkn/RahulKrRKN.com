import { initAllModules } from "./initModules.js";
import { loadEnv } from "./initEnv.js";

export async function initServer() {
  await loadEnv();
  // Dependent modules
  await initAllModules();
}
