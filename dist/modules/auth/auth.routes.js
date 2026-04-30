"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_controller_1 = require("./auth.controller");
const auth_middleware_1 = require("./auth.middleware");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.use((0, cookie_parser_1.default)());
// public
exports.authRouter.post("/create-user", auth_controller_1.createUser);
exports.authRouter.post("/login", auth_controller_1.login);
exports.authRouter.post("/refresh", auth_controller_1.refresh);
exports.authRouter.post("/forgot-password", auth_controller_1.forgotPassword);
exports.authRouter.post("/reset-password", auth_controller_1.resetPassword);
// protected
exports.authRouter.get("/me", auth_middleware_1.requireAuth, auth_controller_1.me);
exports.authRouter.patch("/me", auth_middleware_1.requireAuth, auth_controller_1.updateMe);
exports.authRouter.delete("/me", auth_middleware_1.requireAuth, auth_controller_1.deleteMe);
exports.authRouter.post("/logout", auth_middleware_1.requireAuth, auth_controller_1.logout);
exports.authRouter.post("/change-password", auth_middleware_1.requireAuth, auth_controller_1.changePassword);
// admin-only: admin creates users
exports.authRouter.post("/admin/users", auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)("ADMIN"), auth_controller_1.adminCreateUser);
