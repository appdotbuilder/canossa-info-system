
import { serial, text, pgTable, timestamp, boolean, varchar } from 'drizzle-orm/pg-core';

export const campusActivitiesTable = pgTable('campus_activities', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description').notNull(),
  content: text('content').notNull(),
  image_url: text('image_url'), // Nullable by default
  activity_date: timestamp('activity_date').notNull(),
  is_featured: boolean('is_featured').notNull().default(false),
  is_published: boolean('is_published').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

export const pageContentsTable = pgTable('page_contents', {
  id: serial('id').primaryKey(),
  page_slug: varchar('page_slug', { length: 100 }).notNull().unique(),
  title: varchar('title', { length: 200 }).notNull(),
  content: text('content').notNull(),
  meta_description: text('meta_description'), // Nullable by default
  is_published: boolean('is_published').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

export const administratorsTable = pgTable('administrators', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password_hash: varchar('password_hash', { length: 255 }).notNull(),
  full_name: varchar('full_name', { length: 100 }).notNull(),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  last_login: timestamp('last_login') // Nullable by default
});

// TypeScript types for the table schemas
export type CampusActivity = typeof campusActivitiesTable.$inferSelect;
export type NewCampusActivity = typeof campusActivitiesTable.$inferInsert;

export type PageContent = typeof pageContentsTable.$inferSelect;
export type NewPageContent = typeof pageContentsTable.$inferInsert;

export type Administrator = typeof administratorsTable.$inferSelect;
export type NewAdministrator = typeof administratorsTable.$inferInsert;

// Export all tables for proper query building
export const tables = {
  campusActivities: campusActivitiesTable,
  pageContents: pageContentsTable,
  administrators: administratorsTable
};
