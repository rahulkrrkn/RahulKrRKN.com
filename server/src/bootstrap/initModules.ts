import { initAuth } from "./../auth/bootstrap/index.js";

export async function initAllModules() {
  await initAuth();
}
