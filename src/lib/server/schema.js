import sqlite from './sqlite';

export async function schema() {
    const queries = [`
        CREATE TABLE IF NOT EXISTS auth (
            id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
            );`,
        `CREATE TABLE IF NOT EXISTS url (
            id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
            long_url TEXT NOT NULL,
            short_url TEXT NOT NULL,
            timestamp INTEGER NOT NULL DEFAULT (unixepoch())
        );
    `];

    for (const query of queries) {
        sqlite(query);
    }
}
