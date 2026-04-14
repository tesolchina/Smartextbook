import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthUser {
  userId: string;
  email: string;
  displayName: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function getJwtSecret(): string {
  const secret = process.env["JWT_SECRET"];
  if (!secret) throw new Error("JWT_SECRET environment variable is not set");
  return secret;
}

export function parseAuthCookie(req: Request): AuthUser | null {
  try {
    const token = req.cookies?.["lb_token"] as string | undefined;
    if (!token) return null;
    const payload = jwt.verify(token, getJwtSecret()) as AuthUser & { iat: number; exp: number };
    return { userId: payload.userId, email: payload.email, displayName: payload.displayName };
  } catch {
    return null;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const user = parseAuthCookie(req);
  if (!user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  req.user = user;
  next();
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  req.user = parseAuthCookie(req) ?? undefined;
  next();
}
