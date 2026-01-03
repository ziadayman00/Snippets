import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Use unique env var to avoid system conflicts
const connectionString = process.env.SNIPPETS_DATABASE_URL || process.env.DATABASE_URL!;

console.log("DB Client Config:", {
  url_host_masked: connectionString ? connectionString.split("@")[1] : "undefined",
  ssl_mode: "require" 
});

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false, ssl: "require" });
export const db = drizzle(client, { schema });
