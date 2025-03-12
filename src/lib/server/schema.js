import sqlite from './sqlite';
import { TABLE_AUTH, TABLE_URL, TABLE_HISTORY } from './model/tables';

export default function setSchema() {
    const queries = [
        `CREATE TABLE IF NOT EXISTS ${TABLE_AUTH} (
            id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        );`,
        `CREATE TABLE IF NOT EXISTS ${TABLE_URL} (
            id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
            short_url TEXT NOT NULL UNIQUE,
            long_url TEXT NOT NULL,
            timestamp INTEGER NOT NULL
        );`,
        `CREATE TABLE IF NOT EXISTS ${TABLE_HISTORY} (
            id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
            url_id TEXT NOT NULL,
            ref TEXT,
            agent TEXT,
            address TEXT,
            timestamp INTEGER NOT NULL,
            FOREIGN KEY (url_id) REFERENCES url(id) ON DELETE CASCADE
        );`,
    ];

    for (const query of queries) {
        sqlite(query);
    }
}
