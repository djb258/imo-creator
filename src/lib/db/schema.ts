import { mysqlTable, varchar, text, timestamp, int, boolean, json } from 'drizzle-orm/mysql-core';
import { createId } from '@paralleldrive/cuid2';

// Users table for authentication
export const users = mysqlTable('users', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  clerkId: varchar('clerk_id', { length: 128 }).unique().notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 128 }),
  lastName: varchar('last_name', { length: 128 }),
  imageUrl: varchar('image_url', { length: 512 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// Projects table for IMO Creator projects
export const projects = mysqlTable('projects', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  userId: varchar('user_id', { length: 128 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 50 }).default('active'),
  repoUrl: varchar('repo_url', { length: 512 }),
  deployUrl: varchar('deploy_url', { length: 512 }),
  plasmicProjectId: varchar('plasmic_project_id', { length: 128 }),
  bmadTraceId: varchar('bmad_trace_id', { length: 128 }),
  config: json('config'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// BMAD traces for performance tracking
export const bmadTraces = mysqlTable('bmad_traces', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  traceId: varchar('trace_id', { length: 128 }).unique().notNull(),
  projectId: varchar('project_id', { length: 128 }),
  userId: varchar('user_id', { length: 128 }).notNull(),
  target: varchar('target', { length: 255 }).notNull(),
  duration: int('duration_ms').notNull(),
  exitCode: int('exit_code').notNull(),
  metadata: json('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Component library for reusable components
export const components = mysqlTable('components', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  userId: varchar('user_id', { length: 128 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }),
  description: text('description'),
  code: text('code').notNull(),
  props: json('props'),
  tags: json('tags'),
  isPublic: boolean('is_public').default(false),
  usageCount: int('usage_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type BmadTrace = typeof bmadTraces.$inferSelect;
export type NewBmadTrace = typeof bmadTraces.$inferInsert;
export type Component = typeof components.$inferSelect;
export type NewComponent = typeof components.$inferInsert;