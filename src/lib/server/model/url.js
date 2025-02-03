import sqlite from '../sqlite';
import { TABLE_URL, TABLE_HISTORY } from './tables';

export default {
    searchData: async (keyword) => {
        try {
            const search = `%${keyword}%`;

            const result = sqlite(`
                SELECT * FROM ${TABLE_URL}
                WHERE LOWER(long_url) LIKE LOWER(?)
                OR LOWER(short_url) LIKE LOWER(?);
            `, [search, search]);

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when getting data!');
        }
    },
    getLongURL: async (short_url) => {
        try {
            const timestamp = Date.now();

            const result = sqlite(`
                SELECT
                    id,
                    long_url,
                    short_url,
                    timestamp
                FROM ${TABLE_URL}
                WHERE short_url = ?;
            `, [short_url]);

            if (result?.length) sqlite(`
                    INSERT INTO ${TABLE_HISTORY} (
                        url_id,
                        timestamp
                    ) VALUES (?, ?);
                `, [result[0].id, timestamp]);

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when getting data!');
        }
    },
    getData: async (short_url) => {
        try {
            const result = short_url
                ? sqlite(`
                    SELECT
                        t.id,
                        t.long_url,
                        t.short_url,
                        t.timestamp,
                        h.timestamp AS history_timestamp
                    FROM ${TABLE_URL} t
                    LEFT JOIN ${TABLE_HISTORY} h
                    ON t.id = h.url_id
                    WHERE t.short_url = ?;
                `, [short_url])
                : sqlite(`
                    SELECT 
                        id,
                        long_url,
                        short_url,
                        timestamp
                    FROM ${TABLE_URL}
                    ORDER BY timestamp DESC;
                `);

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when getting data!');
        }
    },
    createData: async (data) => {
        try {
            const timestamp = Date.now();

            const result = sqlite(`
                INSERT INTO ${TABLE_URL} (
                    long_url,
                    short_url,
                    timestamp
                ) VALUES (?, ?, ?);
            `, [
                data.long_url,
                data.short_url,
                timestamp
            ]);

            return {
                column: {
                    long_url: data.long_url,
                    short_url: data.short_url,
                    timestamp,
                },
                ...result,
            };
        } catch (e) {
            console.error(e);
            throw new Error('Error when creating data!');
        }
    },
    editData: async (data, id) => {
        try {
            const result = sqlite(`
                UPDATE ${TABLE_URL} SET
                    long_url  = COALESCE(?, long_url),
                    short_url = COALESCE(?, short_url)
                WHERE id = ?;
            `, [
                data.long_url || null,
                data.short_url || null,
                id
            ]);

            return {
                column: {
                    id,
                    long_url: data.long_url,
                    short_url: data.short_url,
                },
                ...result,
            };
        } catch (e) {
            console.error(e);
            throw new Error('Error when editing data!');
        }
    },
    deleteData: async (id) => {
        try {
            const result = sqlite(`
                DELETE FROM ${TABLE_URL}
                WHERE id = ?;
            `, [id]);

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when deleting data!');
        }
    },
}
