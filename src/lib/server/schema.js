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
            short_url TEXT NOT NULL UNIQUE,
            timestamp INTEGER NOT NULL DEFAULT (unixepoch())
        );`,
        `CREATE TABLE IF NOT EXISTS history (
            id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
            url_id TEXT NOT NULL,
            timestamp INTEGER NOT NULL DEFAULT (unixepoch()),
            FOREIGN KEY (url_id) REFERENCES url(id) ON DELETE CASCADE
        );`,
    ];

    for (const query of queries) {
        sqlite(query);
    }
}
