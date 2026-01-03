import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local", override: true });

const rawUrl = process.env.SNIPPETS_DATABASE_URL || process.env.DATABASE_URL;

if (!rawUrl) {
  throw new Error("SNIPPETS_DATABASE_URL (or DATABASE_URL) is missing");
}

console.log("Drizzle Kit - Loaded DATABASE_URL:", rawUrl.split("@")[1]); // Log only the host part for safety

// Force SSL mode if not present
const url = rawUrl.includes("sslmode=") ? rawUrl : `${rawUrl}?sslmode=require`;

export default defineConfig({
  schema: "./lib/drizzle/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url,
  },
});
