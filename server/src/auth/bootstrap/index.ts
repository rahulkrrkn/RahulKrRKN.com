import { initMongoAuth } from "./initMongoAuth.js";
import { initMongoAuthIndexes } from "./initMongoAuthIndex.js";

export async function initAuth() {
  await initMongoAuth();
  await initMongoAuthIndexes();
}
