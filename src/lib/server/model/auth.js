import sqlite from '../sqlite';
import { TABLE_AUTH } from './tables';

export default {
    getData: async (data) => {
        try {
            const result = sqlite(`
                SELECT
                    id,
                    email,
                    password
                FROM ${TABLE_AUTH}
                ${data ? 'WHERE id = ? OR email = ?' : ''};
            `, data ? [data, data] : []);

            return result.length ? result[0] : null;
        } catch (e) {
            console.error(e);
            throw new Error('Error when getting data!');
        }
    },
    createData: async (data) => {
        try {
            const result = sqlite(`
                    INSERT INTO ${TABLE_AUTH} (
                        email,
                        password
                    ) VALUES (?, ?);
                `, [
                data.email,
                data.password
            ]);

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when creating data!');
        }
    },
    editData: async (data, id) => {
        try {
            const result = sqlite(`
                UPDATE ${TABLE_AUTH} SET
                    email    = COALESCE(?, email),
                    password = COALESCE(?, password)
                WHERE id = ?;
            `, [
                data.email || null,
                data.password || null,
                id
            ]);

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when editing data!');
        }
    },
}
