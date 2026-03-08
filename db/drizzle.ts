import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import path from "path";

config({ path: path.resolve(process.cwd(), ".env.local") }); // or .env.local

export const db = drizzle(process.env.DATABASE_URL!);
