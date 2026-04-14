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

// POST /api/auth/register
router.post("/auth/register", async (req, res) => {
  try {
    const { email, password, displayName } = req.body as {
      email?: string;
      password?: string;
      displayName?: string;
    };

    if (!email || !password || !displayName) {
      res.status(400).json({ error: "email, password, and displayName are required" });
      return;
    }

    const emailLower = email.toLowerCase().trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLower)) {
      res.status(400).json({ error: "Invalid email address" });
      return;
    }

    if (password.length < 8) {
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
      // Unverified — resend OTP
    } else {
      const passwordHash = await bcrypt.hash(password, 12);
      await db.insert(usersTable).values({
        id: nanoid(),
        email: emailLower,
        passwordHash,
        displayName: displayName.trim().slice(0, 60),
        emailVerified: false,
      });
    }

    // Always create a fresh OTP
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await db.insert(emailOtpsTable).values({
      email: emailLower,
      otp,
      purpose: "verify",
      expiresAt,
      used: false,
    });

    const sent = await sendOtpEmail(emailLower, otp, "verify");

    res.json({
      ok: true,
      emailSent: sent,
      message: sent
        ? "Verification code sent — please check your email"
        : "SMTP not configured — check server logs for OTP",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// POST /api/auth/verify-otp
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

    // Mark OTP as used
    await db
      .update(emailOtpsTable)
      .set({ used: true })
      .where(eq(emailOtpsTable.id, record.id));

    // Mark user as verified
    const [user] = await db
      .update(usersTable)
      .set({ emailVerified: true })
      .where(eq(usersTable.email, emailLower))
      .returning();

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const authUser: AuthUser = {
      userId: user.id,
      email: user.email,
      displayName: user.displayName,
    };

    setCookieToken(res, authUser);
    res.json({ ok: true, user: authUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Verification failed" });
  }
});

// POST /api/auth/login
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

    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    if (!user.emailVerified) {
      // Resend verification OTP
      const otp = generateOtp();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
      await db.insert(emailOtpsTable).values({
        email: emailLower,
        otp,
        purpose: "verify",
        expiresAt,
        used: false,
      });
      await sendOtpEmail(emailLower, otp, "verify");
      res.status(403).json({
        error: "Email not verified",
        needsVerification: true,
        message: "A new verification code has been sent to your email",
      });
      return;
    }

    const authUser: AuthUser = {
      userId: user.id,
      email: user.email,
      displayName: user.displayName,
    };

    setCookieToken(res, authUser);
    res.json({ ok: true, user: authUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// POST /api/auth/logout
router.post("/auth/logout", (_req, res) => {
  res.clearCookie(COOKIE_NAME, { path: "/" });
  res.json({ ok: true });
});

// GET /api/auth/me
router.get("/auth/me", (req, res) => {
  const user = parseAuthCookie(req);
  if (!user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  res.json({ user });
});

// POST /api/auth/resend-otp
router.post("/auth/resend-otp", async (req, res) => {
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
      res.json({ ok: true }); // Don't leak existence
      return;
    }
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await db.insert(emailOtpsTable).values({
      email: emailLower,
      otp,
      purpose: "verify",
      expiresAt,
      used: false,
    });
    const sent = await sendOtpEmail(emailLower, otp, "verify");
    res.json({ ok: true, emailSent: sent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to resend code" });
  }
});

export default router;
