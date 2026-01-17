import { getRedis } from "../core/config/redis.config.js";

export async function initRedis(): Promise<void> {
  const redis = getRedis();
  await redis.ping();
  console.log("✅ Redis ping successful");
}
