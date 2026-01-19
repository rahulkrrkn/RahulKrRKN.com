import bcrypt from "bcrypt";
import { getRedis } from "../config/redis.config.js";

const DEFAULT_OTP_TTL_SECONDS = 5 * 60; // 5 minutes
const DEFAULT_MAX_ATTEMPTS = 5;

type OtpPurpose = "AUTH" | "RESET_PASSWORD" | "VERIFY_EMAIL" | "VERIFY_MOBILE";

type SaveOtpInput = {
  channel: "email" | "mobile" | "other";
  identifier: string; // email or phone number
  otp: string;
  purpose?: OtpPurpose;
  ttlSeconds?: number;
  maxAttempts?: number;
};

type VerifyOtpInput = {
  channel: "email" | "mobile" | "other";
  identifier: string;
  otp: string;
  purpose?: OtpPurpose;
};

type OtpStoredData = {
  otpHash: string;
  attempts: number;
  maxAttempts: number;
  purpose: OtpPurpose;
};

function otpKey(channel: string, identifier: string, purpose: OtpPurpose) {
  return `otp:${purpose}:${channel}:${identifier}`;
}

export async function saveOtp(input: SaveOtpInput) {
  const redis = getRedis();

  const purpose = input.purpose ?? "AUTH";
  const ttlSeconds = input.ttlSeconds ?? DEFAULT_OTP_TTL_SECONDS;
  const maxAttempts = input.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;

  const otpHash = await bcrypt.hash(input.otp, 10);

  const payload: OtpStoredData = {
    otpHash,
    attempts: 0,
    maxAttempts,
    purpose,
  };

  await redis.set(
    otpKey(input.channel, input.identifier, purpose),
    JSON.stringify(payload),
    "EX",
    ttlSeconds,
  );
}

export async function verifyOtp(input: VerifyOtpInput) {
  const redis = getRedis();

  const purpose = input.purpose ?? "AUTH";
  const key = otpKey(input.channel, input.identifier, purpose);

  const raw = await redis.get(key);

  if (!raw) {
    return { ok: false, reason: "OTP_EXPIRED" as const };
  }

  const data = JSON.parse(raw) as OtpStoredData;

  if (data.attempts >= data.maxAttempts) {
    await redis.del(key);
    return { ok: false, reason: "TOO_MANY_ATTEMPTS" as const };
  }

  const isMatch = await bcrypt.compare(input.otp, data.otpHash);

  if (!isMatch) {
    data.attempts += 1;

    const ttl = await redis.ttl(key);

    await redis.set(
      key,
      JSON.stringify(data),
      "EX",
      ttl > 0 ? ttl : DEFAULT_OTP_TTL_SECONDS,
    );

    return { ok: false, reason: "OTP_INVALID" as const };
  }

  // success → delete OTP (no reuse)
  await redis.del(key);

  return { ok: true, reason: "OTP_VALID" as const };
}

export async function clearOtp(params: {
  channel: "email" | "mobile" | "other";
  identifier: string;
  purpose?: OtpPurpose;
}) {
  const redis = getRedis();
  const purpose = params.purpose ?? "AUTH";

  await redis.del(otpKey(params.channel, params.identifier, purpose));
}
