import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const Users = sqliteTable('Users', {
	id: text('id').primaryKey()
		.$defaultFn(() => sql`lower(hex(randomblob(16)))`),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
});

export const Urls = sqliteTable('Urls', {
	id: text('id').primaryKey()
		.$defaultFn(() => sql`lower(hex(randomblob(16)))`),
	shortUrl: text('short_url').notNull().unique(),
	longUrl: text('long_url').notNull(),
	timestamp: integer('timestamp').notNull(),
});

export const Histories = sqliteTable('Histories', {
	id: text('id').primaryKey()
		.$defaultFn(() => sql`lower(hex(randomblob(16)))`),
	urlId: text('url_id').notNull()
		.references(() => Urls.id, { onDelete: 'cascade' }),
	ref: text('ref'),
	agent: text('agent'),
	timestamp: integer('timestamp').notNull(),
});
