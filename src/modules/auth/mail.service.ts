import nodemailer from "nodemailer";
import { env } from "../../config/env";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465, // true for 465
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASS }
});

export async function sendResetPasswordEmail(to: string, resetUrl: string) {
  await transporter.sendMail({
    from: env.SMTP_FROM,
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
