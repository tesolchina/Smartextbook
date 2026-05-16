import { type Request } from "express";

const rateMaps = new Map<string, Map<string, number[]>>();

export function getClientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
  return req.socket.remoteAddress ?? "unknown";
}

/**
 * In-memory sliding-window rate limiter.
 * @param bucketId  A unique name per endpoint (e.g. "ai-tutor", "ieee-lesson")
 * @param ip        Client IP from getClientIp()
 * @param limit     Max requests allowed in the window
 * @param windowMs  Window size in milliseconds (default: 1 hour)
 * @returns true if the request is allowed, false if rate-limited
 */
export function checkRateLimit(
  bucketId: string,
  ip: string,
  limit: number,
  windowMs = 60 * 60 * 1000,
): boolean {
  if (!rateMaps.has(bucketId)) rateMaps.set(bucketId, new Map());
  const map = rateMaps.get(bucketId)!;

  const now = Date.now();
  const cutoff = now - windowMs;
  const timestamps = (map.get(ip) ?? []).filter((t) => t > cutoff);

  if (timestamps.length >= limit) return false;

  timestamps.push(now);
  map.set(ip, timestamps);
  return true;
}
