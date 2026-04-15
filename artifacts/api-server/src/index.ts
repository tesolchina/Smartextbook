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
      const { rows: tableRows } = await client.query<{ count: string }>(
        `SELECT COUNT(*) as count FROM information_schema.tables
         WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`
      );

      const existingTableCount = parseInt(tableRows[0]?.count ?? "0", 10);

      if (existingTableCount > 0) {
        const journal = JSON.parse(
          fs.readFileSync(path.join(migrationsFolder, "meta/_journal.json"), "utf8")
        ) as { entries: Array<{ tag: string; when: number }> };

        for (const entry of journal.entries) {
          const sqlContent = fs.readFileSync(
            path.join(migrationsFolder, `${entry.tag}.sql`),
            "utf8"
          );
          const hash = crypto.createHash("sha256").update(sqlContent).digest("hex");
          await client.query(
            `INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ($1, $2)`,
            [hash, entry.when]
          );
        }

        logger.info(
          { count: journal.entries.length },
          "Seeded migration tracking: marked all migrations as applied (tables already existed from prior push/migration)."
        );
      }
    }
  } finally {
    client.release();
  }

  await migrate(db, { migrationsFolder });
  logger.info("Database migrations complete");
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
