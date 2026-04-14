import { Router } from "express";
import { eq, and, gt } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { db, usersTable, emailOtpsTable } from "@workspace/db";
import { sendOtpEmail } from "../lib/mailer";
import { getJwtSecret, parseAuthCookie } from "../middlewares/require-auth";
import type { AuthUser } from "../middlewares/require-auth";

const router = Router();

const COOKIE_NAME = "lb_token";
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function setCookieToken(res: import("express").Response, user: AuthUser): void {
  const token = jwt.sign(user, getJwtSecret(), { expiresIn: "30d" });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

async function issueOtp(email: string, purpose: "verify" | "login"): Promise<string> {
  const otp = generateOtp();
  await db.insert(emailOtpsTable).values({
    email,
    otp,
    purpose,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    used: false,
  });
  return otp;
}

// ─────────────────────────────────────────
// POST /api/auth/register
// Creates account (password optional) + sends email OTP
// ─────────────────────────────────────────
router.post("/auth/register", async (req, res) => {
  try {
    const { email, password, displayName } = req.body as {
      email?: string;
      password?: string;
      displayName?: string;
    };

    if (!email || !displayName) {
      res.status(400).json({ error: "email and displayName are required" });
      return;
    }

    const emailLower = email.toLowerCase().trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLower)) {
      res.status(400).json({ error: "Invalid email address" });
      return;
    }

    if (password && password.length < 8) {
      res.status(400).json({ error: "Password must be at least 8 characters" });
      return;
    }

    const existing = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, emailLower),
    });

    if (existing) {
      if (existing.emailVerified) {
        res.status(409).json({ error: "An account with this email already exists" });
        return;
      }
      // Unverified — update name/password if provided, then resend OTP
      const updates: Record<string, unknown> = { displayName: displayName.trim().slice(0, 60) };
      if (password) updates.passwordHash = await bcrypt.hash(password, 12);
      await db.update(usersTable).set(updates).where(eq(usersTable.id, existing.id));
    } else {
      const passwordHash = password ? await bcrypt.hash(password, 12) : null;
      await db.insert(usersTable).values({
        id: nanoid(),
        email: emailLower,
        passwordHash,
        displayName: displayName.trim().slice(0, 60),
        emailVerified: false,
      });
    }

    const otp = await issueOtp(emailLower, "verify");
    const sent = await sendOtpEmail(emailLower, otp, "verify");

    res.json({
      ok: true,
      emailSent: sent,
      message: sent
        ? "Verification code sent — please check your email"
        : `SMTP not configured — OTP is: ${otp}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// ─────────────────────────────────────────
// POST /api/auth/send-code  (passwordless login)
// Sends a login OTP to an existing verified account
// ─────────────────────────────────────────
router.post("/auth/send-code", async (req, res) => {
  try {
    const { email } = req.body as { email?: string };
    if (!email) {
      res.status(400).json({ error: "email is required" });
      return;
    }
    const emailLower = email.toLowerCase().trim();

    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, emailLower),
    });

    if (!user) {
      // Don't reveal if account exists, but tell them to register
      res.status(404).json({
        error: "No account found with this email address. Please create an account first.",
        notFound: true,
      });
      return;
    }

    if (!user.emailVerified) {
      // Account exists but not verified — resend verify OTP
      const otp = await issueOtp(emailLower, "verify");
      const sent = await sendOtpEmail(emailLower, otp, "verify");
      res.status(403).json({
        error: "Email not verified",
        needsVerification: true,
        emailSent: sent,
        message: sent
          ? "A verification code has been sent to your email"
          : `SMTP not configured — OTP is: ${otp}`,
      });
      return;
    }

    // Verified user — send a login OTP
    const otp = await issueOtp(emailLower, "login");
    const sent = await sendOtpEmail(emailLower, otp, "login" as "verify");

    res.json({
      ok: true,
      emailSent: sent,
      message: sent
        ? "Login code sent — please check your email"
        : `SMTP not configured — OTP is: ${otp}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send code" });
  }
});

// ─────────────────────────────────────────
// POST /api/auth/login  (password-based)
// ─────────────────────────────────────────
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      res.status(400).json({ error: "email and password are required" });
      return;
    }

    const emailLower = email.toLowerCase().trim();

    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, emailLower),
    });

    if (!user || !user.passwordHash) {
      res.status(401).json({
        error: "No password set for this account. Please sign in with an email code instead.",
        useCode: true,
      });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      res.status(401).json({ error: "Incorrect password" });
      return;
    }

    if (!user.emailVerified) {
      const otp = await issueOtp(emailLower, "verify");
      const sent = await sendOtpEmail(emailLower, otp, "verify");
      res.status(403).json({
        error: "Email not verified",
        needsVerification: true,
        emailSent: sent,
        message: sent
          ? "A verification code has been sent to your email"
          : `SMTP not configured — OTP is: ${otp}`,
      });
      return;
    }

    setCookieToken(res, { userId: user.id, email: user.email, displayName: user.displayName });
    res.json({ ok: true, user: { userId: user.id, email: user.email, displayName: user.displayName } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// ─────────────────────────────────────────
// POST /api/auth/verify-otp
// Works for both registration verify AND passwordless login
// ─────────────────────────────────────────
router.post("/auth/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body as { email?: string; otp?: string };

    if (!email || !otp) {
      res.status(400).json({ error: "email and otp are required" });
      return;
    }

    const emailLower = email.toLowerCase().trim();
    const now = new Date();

    const record = await db.query.emailOtpsTable.findFirst({
      where: and(
        eq(emailOtpsTable.email, emailLower),
        eq(emailOtpsTable.otp, otp.trim()),
        eq(emailOtpsTable.used, false),
        gt(emailOtpsTable.expiresAt, now)
      ),
    });

    if (!record) {
      res.status(400).json({ error: "Invalid or expired verification code" });
      return;
    }

    await db.update(emailOtpsTable).set({ used: true }).where(eq(emailOtpsTable.id, record.id));

    const [user] = await db
      .update(usersTable)
      .set({ emailVerified: true })
      .where(eq(usersTable.email, emailLower))
      .returning();

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    setCookieToken(res, { userId: user.id, email: user.email, displayName: user.displayName });
    res.json({ ok: true, user: { userId: user.id, email: user.email, displayName: user.displayName } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Verification failed" });
  }
});

// ─────────────────────────────────────────
// POST /api/auth/logout
// ─────────────────────────────────────────
router.post("/auth/logout", (_req, res) => {
  res.clearCookie(COOKIE_NAME, { path: "/" });
  res.json({ ok: true });
});

// ─────────────────────────────────────────
// GET /api/auth/me
// ─────────────────────────────────────────
router.get("/auth/me", (req, res) => {
  const user = parseAuthCookie(req);
  if (!user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  res.json({ user });
});

// ─────────────────────────────────────────
// POST /api/auth/resend-otp
// ─────────────────────────────────────────
router.post("/auth/resend-otp", async (req, res) => {
  try {
    const { email, purpose } = req.body as { email?: string; purpose?: string };
    if (!email) {
      res.status(400).json({ error: "email is required" });
      return;
    }
    const emailLower = email.toLowerCase().trim();
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, emailLower),
    });
    if (!user) {
      res.json({ ok: true }); // Don't leak existence
      return;
    }
    const otpPurpose = (purpose === "login" && user.emailVerified) ? "login" : "verify";
    const otp = await issueOtp(emailLower, otpPurpose);
    const sent = await sendOtpEmail(emailLower, otp, "verify");
    res.json({ ok: true, emailSent: sent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to resend code" });
  }
});

export default router;
