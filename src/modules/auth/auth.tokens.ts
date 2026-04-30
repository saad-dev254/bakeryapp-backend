import * as jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { env } from "../../config/env";
import { UserRole } from "./user.model";

export type JwtPayload = {
  sub: string; // user id
  role: UserRole;
  email: string;
};

function signOptions(expiresIn: SignOptions["expiresIn"]): SignOptions {
  return { expiresIn };
}

export function signAccessToken(payload: JwtPayload) {
  const secret: Secret = env.JWT_ACCESS_SECRET;
  return jwt.sign(payload, secret, signOptions(env.JWT_ACCESS_EXPIRES_IN as any));
}

export function signRefreshToken(payload: JwtPayload) {
  const secret: Secret = env.JWT_REFRESH_SECRET;
  return jwt.sign(payload, secret, signOptions(env.JWT_REFRESH_EXPIRES_IN as any));
}

export function verifyAccessToken(token: string) {
  const secret: Secret = env.JWT_ACCESS_SECRET;
  return jwt.verify(token, secret) as JwtPayload & { iat: number; exp: number };
}

export function verifyRefreshToken(token: string) {
  const secret: Secret = env.JWT_REFRESH_SECRET;
  return jwt.verify(token, secret) as JwtPayload & { iat: number; exp: number };
}

export async function hashValue(value: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(value, salt);
}

export async function compareHash(value: string, hash: string) {
  return bcrypt.compare(value, hash);
}

export function createResetToken() {
  const raw = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  return { raw, hash };
}

export function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}
