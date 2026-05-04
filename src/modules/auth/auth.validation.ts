import { z } from "zod";

export const loginSchema = z.object({
  phoneNumber: z.string().min(11),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "USER", "VENDOR", "RIDER"])
});

export const adminCreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  phoneNumber: z.string().min(11).max(11),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "USER", "VENDOR", "RIDER"]).default("USER"),
  isActive: z.boolean().optional(),
  isProfileComplete: z.boolean().optional()
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6)
});

export const forgotPasswordSchema = z.object({
  email: z.string().email()
});

export const resetPasswordSchema = z.object({
  token: z.string().min(10),
  newPassword: z.string().min(6)
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  isProfileComplete: z.boolean().optional()
});
