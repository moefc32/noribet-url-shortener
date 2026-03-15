import { eq, like, desc, sql } from 'drizzle-orm';
import { db } from '../drizzle';
import { Urls, Histories } from '../schema';

export default {
    searchData: async (keyword, limit = 10, offset = 0) => {
        try {
            const search = `%${keyword}%`;

            const result = await db
                .select({
                    id: Urls.id,
                    short_url: Urls.short_url,
                    long_url: Urls.long_url,
                    clicks: sql`COUNT(${Histories.url_id})`,
                    timestamp: Urls.timestamp,
                })
                .from(Urls)
                .leftJoin(Histories, eq(Urls.id, Histories.url_id))
                .where(
                    sql`LOWER(${Urls.short_url}) LIKE LOWER(${search})
                        OR LOWER(${Urls.long_url}) LIKE LOWER(${search})`
                )
                .groupBy(
                    Urls.id,
                    Urls.short_url,
                    Urls.long_url,
                    Urls.timestamp
                )
                .orderBy(desc(sql`COALESCE(${Histories.timestamp}, 0)`))
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
                .select({ short_url: Urls.short_url })
                .from(Urls)
                .where(eq(Urls.short_url, short_url))
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
                    id: Urls.id,
                    long_url: Urls.long_url,
                })
                .from(Urls)
                .where(eq(Urls.short_url, data.short_url));

            if (result?.length) {
                await db.insert(Histories).values({
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
                        id: Urls.id,
                        short_url: Urls.short_url,
                        long_url: Urls.long_url,
                        clicks: sql`COUNT(${Histories.url_id}) OVER()`,
                        timestamp: Urls.timestamp,
                        ref: Histories.ref,
                        agent: Histories.agent,
                        history_timestamp: Histories.timestamp,
                    })
                    .from(Urls)
                    .leftJoin(Histories, eq(Urls.id, Histories.url_id))
                    .where(eq(Urls.short_url, short_url))
                    .orderBy(desc(sql`COALESCE(${Histories.timestamp}, 0)`))
                    .limit(limit)
                    .offset(offset)
                : await db
                    .select({
                        urls: sql`COUNT(${Urls.id}) OVER()`,
                        id: Urls.id,
                        short_url: Urls.short_url,
                        long_url: Urls.long_url,
                        clicks: sql`COUNT(${Histories.url_id})`,
                        timestamp: Urls.timestamp,
                    })
                    .from(Urls)
                    .leftJoin(Histories, eq(Urls.id, Histories.url_id))
                    .groupBy(
                        Urls.id,
                        Urls.short_url,
                        Urls.long_url,
                        Urls.timestamp
                    )
                    .orderBy(desc(Urls.timestamp))
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

            const result = await db.insert(Urls)
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
            const result = await db.update(Urls)
                .set({
                    short_url: data.short_url ?? undefined,
                    long_url: data.long_url ?? undefined,
                })
                .where(eq(Urls.id, id))
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
            const result = await db.delete(Urls)
                .where(eq(Urls.id, id));

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when deleting data!');
        }
    },
}
