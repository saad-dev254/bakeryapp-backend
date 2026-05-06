import { HttpError } from "../../utils/httpError";
import { User } from "./user.model";
import {
  compareHash,
  createResetToken,
  hashValue,
  sha256,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from "./auth.tokens";
import { sendResetPasswordEmail } from "./mail.service";
import { env } from "../../config/env";

export async function createUser(
  dto: {
    email: string;
    name: string;
    phoneNumber: string;
    password: string;
    role: "ADMIN" | "USER" | "VENDOR" | "RIDER";
    isActive?: boolean;
    isProfileComplete?: boolean;
  }
) {
  const exists = await User.findOne({ 
    $or: [
      { email: dto.email.toLowerCase() }, 
      { phoneNumber: dto.phoneNumber }
    ],
    role: dto.role
  });
  if (exists) throw new HttpError(409, `Email or phone number already exists for this ${dto.role}`);

  const passwordHash = await hashValue(dto.password);

  const user = await User.create({
    email: dto.email.toLowerCase(),
    name: dto.name,
    phoneNumber: dto.phoneNumber,
    role: dto.role,
    isActive: true,
    isProfileComplete: dto.role === "VENDOR" || dto.role === "RIDER" ? false : true,
    passwordHash,
    createdBy: "self"
  });

  return sanitizeUser(user);
}

export async function updateUser(id: string, dto: { name?: string; userImage?: string }) {
  const user = await User.findById(id);
  if (!user) throw new HttpError(404, "User not found");

  if (dto.name) user.name = dto.name;
  if (dto.userImage) user.userImage = dto.userImage;

  await user.save();
  return sanitizeUser(user);
}

export async function adminCreateUser(
  adminId: string,
  dto: {
    email: string;
    name: string;
    phoneNumber: string;
    password: string;
    role: "ADMIN" | "USER" | "VENDOR" | "RIDER";
    isActive?: boolean;
    isProfileComplete?: boolean;
  }
) {
  const exists = await User.findOne({
    $or: [{ email: dto.email.toLowerCase() }, { phoneNumber: dto.phoneNumber.trim() }]
  });
  if (exists) throw new HttpError(409, "Email or phone number already exists");

  const passwordHash = await hashValue(dto.password);

  const user = await User.create({
    email: dto.email.toLowerCase(),
    name: dto.name,
    phoneNumber: dto.phoneNumber.trim(),
    role: dto.role,
    isActive: dto.isActive ?? true,
    isProfileComplete: dto.isProfileComplete ?? true,
    passwordHash,
    createdBy: adminId
  });

  return sanitizeUser(user);
}

export async function login(dto: {
  phoneNumber: string;
  password: string;
  role: "ADMIN" | "USER" | "VENDOR" | "RIDER";
}) {
  const user = await User.findOne({ phoneNumber: dto.phoneNumber.trim(), role: dto.role });
  if (!user) throw new HttpError(401, "Invalid phone number, role, or password");
  if (!user.isActive) throw new HttpError(403, "Account is disabled");

  const ok = await compareHash(dto.password, user.passwordHash);
  if (!ok) throw new HttpError(401, "Invalid phone number, role, or password");

  const payload = { sub: String(user._id), role: user.role, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // store hashed refresh token for rotation
  user.refreshTokenHash = sha256(refreshToken);
  await user.save();

  return { accessToken, refreshToken, user: sanitizeUser(user) };
}

export async function refresh(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);

  const user = await User.findById(payload.sub);
  if (!user) throw new HttpError(401, "Invalid refresh token");
  if (!user.isActive) throw new HttpError(403, "Account is disabled");

  if (!user.refreshTokenHash || user.refreshTokenHash !== sha256(refreshToken)) {
    throw new HttpError(401, "Refresh token revoked");
  }

  const newPayload = { sub: String(user._id), role: user.role, email: user.email };
  const accessToken = signAccessToken(newPayload);
  const newRefreshToken = signRefreshToken(newPayload);

  user.refreshTokenHash = sha256(newRefreshToken);
  await user.save();

  return { accessToken, refreshToken: newRefreshToken };
}

export async function logout(userId: string) {
  await User.findByIdAndUpdate(userId, { $unset: { refreshTokenHash: 1 } });
  return true;
}

export async function changePassword(
  userId: string,
  dto: { currentPassword: string; newPassword: string }
) {
  const user = await User.findById(userId);
  if (!user) throw new HttpError(404, "User not found");

  const ok = await compareHash(dto.currentPassword, user.passwordHash);
  if (!ok) throw new HttpError(401, "Current password incorrect");

  user.passwordHash = await hashValue(dto.newPassword);
  user.passwordChangedAt = new Date();
  user.refreshTokenHash = undefined;
  await user.save();

  return true;
}

export async function forgotPassword(email: string) {
  const user = await User.findOne({ email: email.toLowerCase() });
  // security: do not reveal
  if (!user) return true;

  const { raw, hash } = createResetToken();
  user.resetPasswordTokenHash = hash;
  user.resetPasswordExpiresAt = new Date(Date.now() + 15 * 60 * 1000); 
  await user.save();

  const resetUrl = `${env.APP_URL}/reset-password?token=${raw}`;
  await sendResetPasswordEmail(user.email, resetUrl);

  return true;
}

export async function resetPassword(dto: { token: string; newPassword: string }) {
  const tokenHash = sha256(dto.token);

  const user = await User.findOne({
    resetPasswordTokenHash: tokenHash,
    resetPasswordExpiresAt: { $gt: new Date() }
  });

  if (!user) throw new HttpError(400, "Invalid or expired reset token");

  user.passwordHash = await hashValue(dto.newPassword);
  user.passwordChangedAt = new Date();
  user.resetPasswordTokenHash = undefined;
  user.resetPasswordExpiresAt = undefined;
  user.refreshTokenHash = undefined; 
  await user.save();

  return true;
}

export async function getMe(userId: string) {
  const user = await User.findById(userId);
  if (!user) throw new HttpError(404, "User not found");
  return sanitizeUser(user);
}

export async function updateMe(userId: string, dto: { name?: string; userImage?: string; isProfileComplete?: boolean }) {
  const user = await User.findById(userId);
  if (!user) throw new HttpError(404, "User not found");

  if (dto.name) user.name = dto.name;
  if (dto.userImage !== undefined) user.userImage = dto.userImage;
  if (dto.isProfileComplete !== undefined) user.isProfileComplete = dto.isProfileComplete; 

  await user.save();
  return sanitizeUser(user);
}

export async function deleteMe(userId: string) {
  await User.findByIdAndDelete(userId);
  return true;
}

function sanitizeUser(user: any) {
  return {
    id: String(user._id),
    email: user.email,
    name: user.name,
    userImage: user.userImage,
    phoneNumber: user.phoneNumber,
    role: user.role,
    isActive: user.isActive,
    isProfileComplete: user.isProfileComplete,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}
