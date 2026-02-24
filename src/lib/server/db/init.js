import { sql } from 'drizzle-orm';
import { db } from '../db/drizzle';

export default async function setSchema() {
    await db.run(sql`
        CREATE TABLE IF NOT EXISTS auth (
            id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    `);

    await db.run(sql`
        CREATE TABLE IF NOT EXISTS url (
            id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
            short_url TEXT NOT NULL UNIQUE,
            long_url TEXT NOT NULL,
            timestamp INTEGER NOT NULL
        )
    `);

    await db.run(sql`
        CREATE TABLE IF NOT EXISTS history (
            id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
            url_id TEXT NOT NULL,
            ref TEXT,
            agent TEXT,
            timestamp INTEGER NOT NULL,
            FOREIGN KEY (url_id) REFERENCES url(id) ON DELETE CASCADE
        )
    `);
}
