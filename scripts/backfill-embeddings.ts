import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local explicitly
config({ path: resolve(process.cwd(), ".env.local") });

import { db } from "@/lib/drizzle/db";
import { entries } from "@/lib/drizzle/schema";
import { upsertEmbedding } from "@/lib/actions/embeddings";

/**
 * Backfill embeddings for all existing entries
 * Run this once to generate embeddings for snippets created before AI integration
 */
async function backfillEmbeddings() {
  console.log("🚀 Starting embedding backfill...");
  
  try {
    // Get all entries
    const allEntries = await db.select().from(entries);
    
    console.log(`📊 Found ${allEntries.length} entries to process`);
    
    let processed = 0;
    let failed = 0;
    
    for (const entry of allEntries) {
      try {
        console.log(`Processing: ${entry.title}...`);
        await upsertEmbedding(entry.id, entry.title, entry.content);
        processed++;
        console.log(`✅ ${processed}/${allEntries.length} - Success`);
      } catch (error) {
        failed++;
        console.error(`❌ Failed for "${entry.title}":`, error);
      }
      
      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log("\n🎉 Backfill complete!");
    console.log(`✅ Processed: ${processed}`);
    console.log(`❌ Failed: ${failed}`);
    
  } catch (error) {
    console.error("Fatal error during backfill:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

backfillEmbeddings();
