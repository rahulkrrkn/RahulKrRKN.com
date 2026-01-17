import Redis from "ioredis";

let redis: Redis | null = null;

export function getRedis(): Redis {
  if (!redis) {
    redis = new Redis({
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT) || 6379,
      username: process.env.REDIS_USERNAME || undefined,
      password: process.env.REDIS_PASSWORD || undefined,
    });

    redis.on("connect", () => console.log("✅ Redis connected"));
    redis.on("ready", () => console.log("🚀 Redis ready"));
    redis.on("error", (err) => console.error("❌ Redis error:", err));
    redis.on("end", () => console.log("⚠️ Redis connection closed"));
  }

  return redis;
}

export default getRedis;
