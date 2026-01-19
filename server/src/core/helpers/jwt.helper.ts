import jwt, { type Secret, type SignOptions } from "jsonwebtoken";

export type AccessTokenPayload = {
  userId: string;
  email: string;
};

const ACCESS_TOKEN_SECRET: Secret = process.env.JWT_ACCESS_SECRET as Secret;

const ACCESS_MIN = Number(process.env.JWT_ACCESS_EXPIRES_MIN || 15);

const accessOptions: SignOptions = {
  expiresIn: `${ACCESS_MIN}m`,
};

export function signAccessToken(payload: AccessTokenPayload) {
  if (!ACCESS_TOKEN_SECRET) throw new Error("JWT_ACCESS_SECRET missing");
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, accessOptions);
}

export function verifyAccessToken(token: string) {
  if (!ACCESS_TOKEN_SECRET) throw new Error("JWT_ACCESS_SECRET missing");
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as AccessTokenPayload;
}
