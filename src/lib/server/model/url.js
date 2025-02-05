import sqlite from '../sqlite';
import { TABLE_URL, TABLE_HISTORY } from './tables';

export default {
    searchData: async (keyword) => {
        try {
            const search = `%${keyword}%`;

            const result = sqlite(`
                SELECT * FROM ${TABLE_URL}
                WHERE LOWER(short_url) LIKE LOWER(?)
                OR LOWER(long_url) LIKE LOWER(?);
            `, [search, search]);

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when getting data!');
        }
    },
    getLongURL: async (data) => {
        try {
            const timestamp = Date.now();

            const result = sqlite(`
                SELECT
                    id,
                    long_url
                FROM ${TABLE_URL}
                WHERE short_url = ?;
            `, [data.short_url]);

            if (result?.length) sqlite(`
                    INSERT INTO ${TABLE_HISTORY} (
                        url_id,
                        ref,
                        agent,
                        address,
                        timestamp
                    ) VALUES (?, ?, ?, ?, ?);
                `, [
                result[0].id,
                data.ref,
                data.agent,
                data.address,
                timestamp
            ]);

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
                        t.short_url,
                        t.long_url,
                        t.timestamp,
                        h.ref,
                        h.agent,
                        h.address,
                        h.timestamp AS history_timestamp
                    FROM ${TABLE_URL} t
                    LEFT JOIN ${TABLE_HISTORY} h
                    ON t.id = h.url_id
                    WHERE t.short_url = ?
                    ORDER BY COALESCE(h.timestamp, 0) DESC;
                `, [short_url])
                : sqlite(`
                    SELECT 
                        t.id,
                        t.short_url,
                        t.long_url,
                        COUNT(h.url_id) AS clicks,
                        t.timestamp
                    FROM ${TABLE_URL} t
                    LEFT JOIN ${TABLE_HISTORY} h
                    ON t.id = h.url_id
                    GROUP BY t.id
                    ORDER BY t.timestamp DESC;
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
                    short_url,
                    long_url,
                    timestamp
                ) VALUES (?, ?, ?);
            `, [
                data.short_url,
                data.long_url,
                timestamp
            ]);

            return {
                column: {
                    short_url: data.short_url,
                    long_url: data.long_url,
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
                    short_url = COALESCE(?, short_url),
                    long_url  = COALESCE(?, long_url)
                WHERE id = ?;
            `, [
                data.short_url || null,
                data.long_url || null,
                id
            ]);

            return {
                column: {
                    id,
                    short_url: data.short_url,
                    long_url: data.long_url,
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
