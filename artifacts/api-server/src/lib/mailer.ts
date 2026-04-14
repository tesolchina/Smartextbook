import nodemailer from "nodemailer";
import { logger } from "./logger";

function getTransporter() {
  const host = process.env["SMTP_HOST"];
  const port = parseInt(process.env["SMTP_PORT"] ?? "587", 10);
  const user = process.env["SMTP_USER"];
  const pass = process.env["SMTP_PASS"];

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

const FROM_ADDRESS =
  process.env["SMTP_FROM"] ?? `LessonBuilder <noreply@lessonbuilder.app>`;

export async function sendOtpEmail(
  to: string,
  otp: string,
  purpose: "verify" | "reset" = "verify"
): Promise<boolean> {
  const transporter = getTransporter();

  if (!transporter) {
    logger.warn(
      "SMTP not configured (SMTP_HOST/SMTP_USER/SMTP_PASS missing) — OTP would be: " + otp
    );
    return false;
  }

  const subject =
    purpose === "verify"
      ? "Verify your LessonBuilder account"
      : "LessonBuilder — password reset code";

  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#fafaf9;border-radius:12px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:28px">
        <div style="width:36px;height:36px;border-radius:8px;background:#a85c32;display:flex;align-items:center;justify-content:center">
          <span style="color:#fff;font-size:18px">📖</span>
        </div>
        <span style="font-size:20px;font-weight:800;letter-spacing:-0.5px;color:#1c1917">LessonBuilder</span>
      </div>

      <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1c1917">
        ${purpose === "verify" ? "Confirm your email address" : "Your password reset code"}
      </h2>
      <p style="color:#78716c;margin:0 0 28px;font-size:15px;line-height:1.6">
        ${purpose === "verify"
          ? "Enter this code in LessonBuilder to verify your email and activate your account."
          : "Enter this code to reset your password."}
      </p>

      <div style="background:#fff;border:2px dashed #e7e5e4;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
        <span style="font-size:42px;font-weight:900;letter-spacing:10px;color:#1c1917;font-family:monospace">${otp}</span>
        <p style="margin:10px 0 0;font-size:13px;color:#a8a29e">Valid for 15 minutes</p>
      </div>

      <p style="color:#a8a29e;font-size:13px;margin:0;line-height:1.6">
        If you didn't request this, you can safely ignore this email. 
        This code expires automatically.
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({ from: FROM_ADDRESS, to, subject, html });
    logger.info({ to, purpose }, "OTP email sent");
    return true;
  } catch (err) {
    logger.error({ err, to }, "Failed to send OTP email");
    return false;
  }
}
