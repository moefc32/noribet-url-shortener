import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const auth = sqliteTable('auth', {
	id: text('id')
		.primaryKey()
		.default(sql`lower(hex(randomblob(16)))`),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
});

export const url = sqliteTable('url', {
	id: text('id')
		.primaryKey()
		.default(sql`lower(hex(randomblob(16)))`),
	short_url: text('short_url').notNull().unique(),
	long_url: text('long_url').notNull(),
	timestamp: integer('timestamp').notNull(),
});

export const history = sqliteTable('history', {
	id: text('id')
		.primaryKey()
		.default(sql`lower(hex(randomblob(16)))`),
	url_id: text('url_id')
		.notNull()
		.references(() => url.id, { onDelete: 'cascade' }),
	ref: text('ref'),
	agent: text('agent'),
	timestamp: integer('timestamp').notNull(),
});
