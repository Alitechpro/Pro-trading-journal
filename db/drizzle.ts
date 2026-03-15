// db/drizzle.ts
import { drizzle } from "drizzle-orm/neon-http";

// Vercel injects DATABASE_URL directly into process.env
// No dotenv, no path, no .env.local needed here
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

export const db = drizzle(process.env.DATABASE_URL);
