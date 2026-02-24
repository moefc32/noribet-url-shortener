import { eq, or } from 'drizzle-orm';
import { db } from '../drizzle';
import { auth } from '../schema';

export default {
    getData: async (data) => {
        try {
            const query = db
                .select({
                    id: auth.id,
                    email: auth.email,
                    password: auth.password,
                })
                .from(auth);

            if (data) {
                query.where(
                    or(
                        eq(auth.id, data),
                        eq(auth.email, data)
                    )
                );
            }

            const result = await query;

            if (!data) return result.length > 0;
            return result.length ? result[0] : null;
        } catch (e) {
            console.error(e);
            throw new Error('Error when getting data!');
        }
    },
    createData: async (data) => {
        try {
            const result = await db.insert(auth).values({
                email: data.email,
                password: data.password,
            }).returning();

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when creating data!');
        }
    },
    editData: async (data, id) => {
        try {
            const result = await db.update(auth)
                .set({
                    email: data.email ?? undefined,
                    password: data.password ?? undefined,
                })
                .where(eq(auth.id, id))
                .returning();

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when editing data!');
        }
    },
}
