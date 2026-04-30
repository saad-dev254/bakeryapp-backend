import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { HttpError } from "../../utils/httpError";
import {
  adminCreateUserSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  updateProfileSchema
} from "./auth.validation";
import * as AuthService from "./auth.service";
import { AuthRequest } from "./auth.middleware";
import { env } from "../../config/env";

const REFRESH_COOKIE = "refresh_token";

function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: "lax",
    path: "/api/auth/refresh"
  });
}

function clearRefreshCookie(res: Response) {
  res.clearCookie(REFRESH_COOKIE, { path: "/api/auth/refresh" });
}

export const createUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  // const adminId = req.user!.id;
  const dto = adminCreateUserSchema.parse(req.body);
  const user = await AuthService.createUser(dto);
  res.status(201).json({ success: true, message: `${dto.role} created`, data: user });
});

export const adminCreateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const adminId = req.user!.id;
  const dto = adminCreateUserSchema.parse(req.body);
  const user = await AuthService.adminCreateUser(adminId, dto);
  res.status(201).json({ success: true, message: "User created", data: user });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const dto = loginSchema.parse(req.body);
  const result = await AuthService.login(dto);

  setRefreshCookie(res, result.refreshToken);

  res.json({
    success: true,
    message: "Logged in",
    data: {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user
    }
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token =
    (req.cookies?.[REFRESH_COOKIE] as string | undefined) ||
    (req.body?.refreshToken as string | undefined);

  if (!token) throw new HttpError(400, "Missing refresh token");

  const result = await AuthService.refresh(token);
  setRefreshCookie(res, result.refreshToken);

  res.json({ success: true, message: "Token refreshed", data: result });
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  await AuthService.logout(req.user!.id);
  clearRefreshCookie(res);
  res.json({ success: true, message: "Logged out" });
});

export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const dto = changePasswordSchema.parse(req.body);
  await AuthService.changePassword(req.user!.id, dto);
  clearRefreshCookie(res); 
  res.json({ success: true, message: "Password changed" });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const dto = forgotPasswordSchema.parse(req.body);
  await AuthService.forgotPassword(dto.email);
  res.json({ success: true, message: "If account exists, reset email sent" });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const dto = resetPasswordSchema.parse(req.body);
  await AuthService.resetPassword(dto);
  res.json({ success: true, message: "Password reset successfully" });
});

export const me = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await AuthService.getMe(req.user!.id);
  res.json({ success: true, data: user });
});

export const updateMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Disallow updating phoneNumber via this route
  // if ('phoneNumber' in req.body) {
  //   throw new HttpError(400, "Updating phoneNumber is not allowed");
  // }
  // if ('role' in req.body) {
  //   throw new HttpError(400, "Updating role is not allowed");
  // }
  const dto = updateProfileSchema.parse(req.body);
  const user = await AuthService.updateMe(req.user!.id, dto);
  res.json({ success: true, message: "Profile updated", data: user });
});

export const deleteMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  await AuthService.deleteMe(req.user!.id);
  clearRefreshCookie(res);
  res.json({ success: true, message: "Profile deleted" });
});
