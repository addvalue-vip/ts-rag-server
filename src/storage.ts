import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ChunkRecord {
  id: string; // <- add this
  chunk: string;
  embedding: number[];
  doc_id: string;
}

export async function storeChunk(record: Omit<ChunkRecord, "id">): Promise<void> {
  const payload = { ...record, id: uuidv4() }; // <- generate unique ID
  const { error } = await supabase.from("rag_chunks").insert(payload);
  if (error) throw new Error(`Supabase insert failed: ${error.message}`);
}
