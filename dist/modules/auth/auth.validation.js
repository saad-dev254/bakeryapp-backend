"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.changePasswordSchema = exports.userUpdateSchema = exports.adminCreateUserSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    phoneNumber: zod_1.z.string().min(11),
    password: zod_1.z.string().min(6),
    role: zod_1.z.enum(["ADMIN", "USER", "VENDOR", "RIDER"])
});
exports.adminCreateUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    name: zod_1.z.string().min(2),
    userImage: zod_1.z.string().optional(),
    phoneNumber: zod_1.z.string().min(11).max(11),
    password: zod_1.z.string().min(6),
    role: zod_1.z.enum(["ADMIN", "USER", "VENDOR", "RIDER"]).default("USER"),
    isActive: zod_1.z.boolean().optional(),
    isProfileComplete: zod_1.z.boolean().optional()
});
exports.userUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    userImage: zod_1.z.string().optional(),
});
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(6),
    newPassword: zod_1.z.string().min(6)
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email()
});
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(10),
    newPassword: zod_1.z.string().min(6)
});
exports.updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    isProfileComplete: zod_1.z.boolean().optional()
});
