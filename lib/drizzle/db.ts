import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Use unique env var to avoid system conflicts
const connectionString = process.env.SNIPPETS_DATABASE_URL || process.env.DATABASE_URL!;

console.log("DB Client Config:", {
  url_host_masked: connectionString ? connectionString.split("@")[1] : "undefined",
  ssl_mode: "require" 
});

// Configure connection pooling to prevent "Max client connections reached"
// In development, Next.js hot reloads can create many connections
export const client = postgres(connectionString, { 
  prepare: false, 
  ssl: "require",
  max: 10, // Maximum number of connections in the pool
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10 // Connection timeout in seconds
});

export const db = drizzle(client, { schema });
