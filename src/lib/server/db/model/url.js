import { eq, like, desc, sql } from 'drizzle-orm';
import { db } from '../drizzle';
import { url, history } from '../schema';

export default {
    searchData: async (keyword, limit = 10, offset = 0) => {
        try {
            const search = `%${keyword}%`;

            const result = await db
                .select({
                    id: url.id,
                    short_url: url.short_url,
                    long_url: url.long_url,
                    clicks: sql`COUNT(${history.url_id})`,
                    timestamp: url.timestamp,
                })
                .from(url)
                .leftJoin(history, eq(url.id, history.url_id))
                .where(
                    sql`LOWER(${url.short_url}) LIKE LOWER(${search})
                        OR LOWER(${url.long_url}) LIKE LOWER(${search})`
                )
                .groupBy(
                    url.id,
                    url.short_url,
                    url.long_url,
                    url.timestamp
                )
                .orderBy(desc(sql`COALESCE(${history.timestamp}, 0)`))
                .limit(limit)
                .offset(offset);

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when getting data!');
        }
    },
    validateShortUrl: async (short_url) => {
        if (!short_url) return [];

        try {
            const result = await db
                .select({ short_url: url.short_url })
                .from(url)
                .where(eq(url.short_url, short_url))
                .limit(1);

            return result;
        } catch (e) {
            console.error(e);
            return [];
        }
    },
    getLongURL: async (data) => {
        try {
            const timestamp = Date.now();

            const result = await db
                .select({
                    id: url.id,
                    long_url: url.long_url,
                })
                .from(url)
                .where(eq(url.short_url, data.short_url));

            if (result?.length) {
                await db.insert(history).values({
                    url_id: result[0].id,
                    ref: data.ref,
                    agent: data.agent,
                    timestamp,
                });
            }

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when getting data!');
        }
    },
    getData: async (short_url, limit = 10, offset = 0) => {
        try {
            const result = short_url
                ? await db
                    .select({
                        id: url.id,
                        short_url: url.short_url,
                        long_url: url.long_url,
                        clicks: sql`COUNT(${history.url_id}) OVER()`,
                        timestamp: url.timestamp,
                        ref: history.ref,
                        agent: history.agent,
                        history_timestamp: history.timestamp,
                    })
                    .from(url)
                    .leftJoin(history, eq(url.id, history.url_id))
                    .where(eq(url.short_url, short_url))
                    .orderBy(desc(sql`COALESCE(${history.timestamp}, 0)`))
                    .limit(limit)
                    .offset(offset)
                : await db
                    .select({
                        urls: sql`COUNT(${url.id}) OVER()`,
                        id: url.id,
                        short_url: url.short_url,
                        long_url: url.long_url,
                        clicks: sql`COUNT(${history.url_id})`,
                        timestamp: url.timestamp,
                    })
                    .from(url)
                    .leftJoin(history, eq(url.id, history.url_id))
                    .groupBy(
                        url.id,
                        url.short_url,
                        url.long_url,
                        url.timestamp
                    )
                    .orderBy(desc(url.timestamp))
                    .limit(limit)
                    .offset(offset);

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when getting data!');
        }
    },
    createData: async (data) => {
        try {
            const timestamp = Date.now();

            const result = await db.insert(url)
                .values({
                    short_url: data.short_url,
                    long_url: data.long_url,
                    timestamp,
                }).returning();


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
            const result = await db.update(url)
                .set({
                    short_url: data.short_url ?? undefined,
                    long_url: data.long_url ?? undefined,
                })
                .where(eq(url.id, id))
                .returning();

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
            const result = await db.delete(url)
                .where(eq(url.id, id));

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when deleting data!');
        }
    },
}
