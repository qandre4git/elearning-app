import { Pool, QueryResult, QueryResultRow } from "pg";

const globalForDb = globalThis as unknown as {
  pgPool: Pool | undefined;
};

export const pool =
  globalForDb.pgPool ??
  new Pool({
    connectionString:
      process.env.DATABASE_URL ||
      "postgresql://postgres:postgrespassword@localhost:5432/elearning_db?schema=public",
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.pgPool = pool;
}

export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  return pool.query<T>(text, params);
}

// Entidades TypeScript
export interface DbUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface DbCategory {
  id: string;
  name: string;
  slug: string;
}

export interface DbCourse {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string | null;
  thumbnail: string | null;
  price: number;
  published: boolean;
  level: string;
  category_id: string | null;
  instructor_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface DbModule {
  id: string;
  title: string;
  description: string | null;
  order: number;
  course_id: string;
}

export interface DbLesson {
  id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  duration_minutes: number;
  order: number;
  module_id: string;
}
