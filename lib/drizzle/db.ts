import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Use unique env var to avoid system conflicts
const connectionString = process.env.SNIPPETS_DATABASE_URL || process.env.DATABASE_URL!;

console.log("DB Client Config:", {
  url_host_masked: connectionString ? connectionString.split("@")[1] : "undefined",
  ssl_mode: "require" 
});

const globalForDb = globalThis as unknown as {
  conn: ReturnType<typeof postgres> | undefined
};

// Disable SSL for local connections (localhost/127.0.0.1)
// Cloud providers (Supabase/Neon) usually require SSL
const isLocal = connectionString.includes("localhost") || connectionString.includes("127.0.0.1");

const conn = globalForDb.conn ?? postgres(connectionString, { 
  prepare: false, 
  ssl: isLocal ? false : "require", // Adaptive SSL
  max: 10, 
  idle_timeout: 20, 
  connect_timeout: 10 
});

if (process.env.NODE_ENV !== "production") globalForDb.conn = conn;

export const client = conn;
export const db = drizzle(client, { schema });
