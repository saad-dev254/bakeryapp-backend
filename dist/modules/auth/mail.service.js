"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetPasswordEmail = sendResetPasswordEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../../config/env");
const transporter = nodemailer_1.default.createTransport({
    host: env_1.env.SMTP_HOST,
    port: env_1.env.SMTP_PORT,
    secure: env_1.env.SMTP_PORT === 465, // true for 465
    auth: { user: env_1.env.SMTP_USER, pass: env_1.env.SMTP_PASS }
});
async function sendResetPasswordEmail(to, resetUrl) {
    await transporter.sendMail({
        from: env_1.env.SMTP_FROM,
        to,
        subject: "Reset your password",
        html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5">
        <h2>Password Reset</h2>
        <p>Click the button below to reset your password:</p>
        <p><a href="${resetUrl}" style="display:inline-block;padding:10px 16px;background:#111;color:#fff;text-decoration:none;border-radius:8px">Reset Password</a></p>
        <p>If you didn't request this, ignore this email.</p>
      </div>
    `
    });
}
