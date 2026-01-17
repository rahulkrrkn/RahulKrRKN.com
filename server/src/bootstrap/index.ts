import { loadEnv } from "./initEnv.js";
import { initRedis } from "./redis.init.js";
import { initAllModules } from "./initModules.js";

loadEnv();

export async function initServer() {
  // Dependent modules
  await initRedis();
  await initAllModules();
}
