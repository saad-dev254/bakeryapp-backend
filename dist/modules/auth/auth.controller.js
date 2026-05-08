"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMe = exports.updateMe = exports.me = exports.resetPassword = exports.forgotPassword = exports.changePassword = exports.logout = exports.refresh = exports.login = exports.adminCreateUser = exports.createUser = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const httpError_1 = require("../../utils/httpError");
const auth_validation_1 = require("./auth.validation");
const AuthService = __importStar(require("./auth.service"));
const env_1 = require("../../config/env");
const REFRESH_COOKIE = "refresh_token";
function setRefreshCookie(res, token) {
    res.cookie(REFRESH_COOKIE, token, {
        httpOnly: true,
        secure: env_1.env.COOKIE_SECURE,
        sameSite: "lax",
        path: "/api/auth/refresh"
    });
}
function clearRefreshCookie(res) {
    res.clearCookie(REFRESH_COOKIE, { path: "/api/auth/refresh" });
}
exports.createUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // const adminId = req.user!.id;
    const dto = auth_validation_1.adminCreateUserSchema.parse(req.body);
    const user = await AuthService.createUser(dto);
    res.status(201).json({ success: true, message: `${dto.role} created`, data: user });
});
exports.adminCreateUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const adminId = req.user.id;
    const dto = auth_validation_1.adminCreateUserSchema.parse(req.body);
    const user = await AuthService.adminCreateUser(adminId, dto);
    res.status(201).json({ success: true, message: "User created", data: user });
});
exports.login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const dto = auth_validation_1.loginSchema.parse(req.body);
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
exports.refresh = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const token = req.cookies?.[REFRESH_COOKIE] ||
        req.body?.refreshToken;
    if (!token)
        throw new httpError_1.HttpError(400, "Missing refresh token");
    const result = await AuthService.refresh(token);
    setRefreshCookie(res, result.refreshToken);
    res.json({ success: true, message: "Token refreshed", data: result });
});
exports.logout = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await AuthService.logout(req.user.id);
    clearRefreshCookie(res);
    res.json({ success: true, message: "Logged out" });
});
exports.changePassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const dto = auth_validation_1.changePasswordSchema.parse(req.body);
    await AuthService.changePassword(req.user.id, dto);
    clearRefreshCookie(res);
    res.json({ success: true, message: "Password changed" });
});
exports.forgotPassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const dto = auth_validation_1.forgotPasswordSchema.parse(req.body);
    await AuthService.forgotPassword(dto.email);
    res.json({ success: true, message: "If account exists, reset email sent" });
});
exports.resetPassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const dto = auth_validation_1.resetPasswordSchema.parse(req.body);
    await AuthService.resetPassword(dto);
    res.json({ success: true, message: "Password reset successfully" });
});
exports.me = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await AuthService.getMe(req.user.id);
    res.json({ success: true, data: user });
});
exports.updateMe = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const files = req.files;
    const userImage = files?.userImage?.[0];
    if (userImage)
        req.body.userImage = `${env_1.env.APP_URL}/uploads/users/${userImage.filename}`;
    const dto = auth_validation_1.updateProfileSchema.parse(req.body);
    const user = await AuthService.updateMe(req.body?.id, dto);
    res.json({ success: true, message: "Profile updated", data: user });
});
exports.deleteMe = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await AuthService.deleteMe(req.user.id);
    clearRefreshCookie(res);
    res.json({ success: true, message: "Profile deleted" });
});
