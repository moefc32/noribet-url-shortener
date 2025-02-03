import { v4 as uuidv4 } from 'uuid';
import sqlite from '../sqlite';
import { TABLE_URL } from './tables';

export default {
    searchData: async (keyword) => {
        try {
            const search = `%${keyword}%`;

            const result = await sqlite(`
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
    getData: async (id) => {
        try {
            const result = !id
                ? sqlite(`
                    SELECT
                        id,
                        long_url
                    FROM ${TABLE_URL}
                    ORDER BY timestamp DESC;
                `)
                : sqlite(`
                    SELECT
                        id,
                        long_url,
                        short_url,
                        timestamp
                    FROM ${TABLE_URL}
                    WHERE id = ?;
                `, [id]);

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when getting data!');
        }
    },
    createData: async (data) => {
        try {
            const timestamp = Date.now();
            const id = uuidv4();

            const result = sqlite(`
                INSERT INTO ${TABLE_URL} (
                    id,
                    long_url,
                    short_url,
                    timestamp
                ) VALUES (?, ?, ?, ?);
            `, [
                id,
                data.long_url,
                data.short_url,
                timestamp
            ]);

            return {
                column: {
                    id,
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
            const timestamp = Date.now();

            const result = sqlite(`
                UPDATE ${TABLE_URL} SET
                    long_url  = COALESCE(?, long_url),
                    short_url = COALESCE(?, short_url),
                    timestamp = ?
                WHERE id = ?;
            `, [
                data.long_url || null,
                data.short_url || null,
                timestamp,
                id
            ]);

            return {
                column: {
                    id,
                    long_url: data.long_url,
                    short_url: data.short_url,
                    timestamp,
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
