import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

export default {
  schema: './src/db/schema.ts',
  out:    './drizzle',
  dialect: 'postgresql',        // ← replaces the old driver: 'pg'
  dbCredentials: {
    url: process.env.DATABASE_URL!,  // ← replaces the old connectionString
  },
} satisfies Config;

// entire code is for Drizzle configuration