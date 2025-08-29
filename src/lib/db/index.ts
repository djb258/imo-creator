import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

// Database connection
const connection = mysql.createPool({
  host: process.env.DATABASE_HOST || 'localhost',
  user: process.env.DATABASE_USERNAME || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'imo_creator',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

// Drizzle instance
export const db = drizzle(connection, { schema, mode: 'default' });

// Helper functions for common operations
export const dbHelpers = {
  // User operations
  async createUser(data: schema.NewUser) {
    const [result] = await db.insert(schema.users).values(data);
    return result;
  },

  async findUserByClerkId(clerkId: string) {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.clerkId, clerkId));
    return user;
  },

  // Project operations
  async createProject(data: schema.NewProject) {
    const [result] = await db.insert(schema.projects).values(data);
    return result;
  },

  async getUserProjects(userId: string) {
    return db.select().from(schema.projects).where(eq(schema.projects.userId, userId));
  },

  // BMAD trace operations
  async saveBmadTrace(data: schema.NewBmadTrace) {
    const [result] = await db.insert(schema.bmadTraces).values(data);
    return result;
  },

  async getProjectTraces(projectId: string) {
    return db.select().from(schema.bmadTraces).where(eq(schema.bmadTraces.projectId, projectId));
  },

  // Component operations
  async saveComponent(data: schema.NewComponent) {
    const [result] = await db.insert(schema.components).values(data);
    return result;
  },

  async getUserComponents(userId: string) {
    return db.select().from(schema.components).where(eq(schema.components.userId, userId));
  },

  async getPublicComponents() {
    return db.select().from(schema.components).where(eq(schema.components.isPublic, true));
  },
};

// Import eq function
import { eq } from 'drizzle-orm';

export * from './schema';
export { eq, and, or, desc, asc } from 'drizzle-orm';