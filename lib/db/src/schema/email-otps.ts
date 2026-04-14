import { pgTable, serial, text, timestamp, boolean, index } from "drizzle-orm/pg-core";

export const emailOtpsTable = pgTable(
  "email_otps",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    otp: text("otp").notNull(),
    purpose: text("purpose").notNull().default("verify"),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    used: boolean("used").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("email_otps_email_idx").on(t.email),
    index("email_otps_expires_idx").on(t.expiresAt),
  ]
);

export type EmailOtp = typeof emailOtpsTable.$inferSelect;
