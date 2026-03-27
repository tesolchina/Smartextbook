import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import fs from "node:fs";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import app from "./app";
import { logger } from "./lib/logger";
import { db, pool } from "@workspace/db";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsFolder = path.join(__dirname, "migrations");

async function runMigrations(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(`CREATE SCHEMA IF NOT EXISTS drizzle`);
    await client.query(`
      CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
        id SERIAL PRIMARY KEY,
        hash text NOT NULL,
        created_at bigint
      )
    `);

    const { rows: existingRows } = await client.query<{ id: number }>(
      `SELECT id FROM drizzle.__drizzle_migrations ORDER BY created_at DESC LIMIT 1`
    );

    if (existingRows.length === 0) {
      const { rows: tableRows } = await client.query<{ exists: boolean }>(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = 'lessons'
        ) AS exists`
      );

      if (tableRows[0]?.exists) {
        const journal = JSON.parse(
          fs.readFileSync(path.join(migrationsFolder, "meta/_journal.json"), "utf8")
        ) as { entries: Array<{ tag: string; when: number }> };

        for (const entry of journal.entries) {
          const sql = fs.readFileSync(
            path.join(migrationsFolder, `${entry.tag}.sql`),
            "utf8"
          );
          const hash = crypto.createHash("sha256").update(sql).digest("hex");
          await client.query(
            `INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ($1, $2)`,
            [hash, entry.when]
          );
        }

        logger.info("Seeded migration tracking for existing database (created via push)");
      }
    }
  } finally {
    client.release();
  }

  await migrate(db, { migrationsFolder });
}

runMigrations()
  .then(() => {
    app.listen(port, (err) => {
      if (err) {
        logger.error({ err }, "Error listening on port");
        process.exit(1);
      }

      logger.info({ port }, "Server listening");
    });
  })
  .catch((err) => {
    logger.error({ err }, "Failed to run database migrations");
    process.exit(1);
  });
