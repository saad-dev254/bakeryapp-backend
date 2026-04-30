"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
require("dotenv/config");
const EnvSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "production", "test"]).default("development"),
    PORT: zod_1.z.coerce.number().int().positive().default(4000),
    MONGODB_URI: zod_1.z.string().min(1),
    CORS_ORIGIN: zod_1.z.string().default("*"),
    RATE_LIMIT_WINDOW_MS: zod_1.z.coerce
        .number()
        .int()
        .positive()
        .default(15 * 60 * 1000),
    RATE_LIMIT_MAX: zod_1.z.coerce.number().int().positive().default(120),
    JWT_ACCESS_SECRET: zod_1.z.string().min(10),
    JWT_REFRESH_SECRET: zod_1.z.string().min(10),
    JWT_ACCESS_EXPIRES_IN: zod_1.z.string().default("15m"),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().default("30d"),
    COOKIE_SECURE: zod_1.z.coerce.boolean().default(false),
    SMTP_HOST: zod_1.z.string().min(1),
    SMTP_PORT: zod_1.z.coerce.number().int().positive(),
    SMTP_USER: zod_1.z.string().min(1),
    SMTP_PASS: zod_1.z.string().min(1),
    SMTP_FROM: zod_1.z.string().min(1),
    APP_URL: zod_1.z.string().url()
});
exports.env = EnvSchema.parse(process.env);
