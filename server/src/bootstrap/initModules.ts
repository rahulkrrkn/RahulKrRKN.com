import { initAuth } from "./../auth/boostrap/";

export async function initAllModules() {
  await initAuth();
}
