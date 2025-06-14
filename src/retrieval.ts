import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// ✅ Define the expected shape of a document chunk
export interface DocumentChunk {
  content: string;
  embedding: number[];
}

// ✅ Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ✅ Fetch top K similar chunks using pgvector SQL function
export async function fetchTopChunksBySimilarity(
  queryEmbedding: number[],
  topK = 5,
  matchThreshold = 0.75
): Promise<DocumentChunk[]> {
  const { data, error } = await supabase.rpc("match_rag_chunks", {
    query_embedding: queryEmbedding,
    match_threshold: matchThreshold,
    match_count: topK,
  });

  if (error) {
    console.error("❌ Error fetching similar chunks:", error.message);
    return [];
  }

  if (!data || !Array.isArray(data)) {
    console.error("❌ Invalid response format from match_rag_chunks");
    return [];
  }

  return data.map((row: any) => ({
    content: row.chunk,
    embedding: [], // Optional: omit or hydrate separately if needed
  }));
}

// ✅ Rank already-fetched chunks (fallback)
export function rankChunksBySimilarity(
  queryEmbedding: number[],
  chunks: DocumentChunk[],
  topK = 5
): string[] {
  const magA = Math.sqrt(queryEmbedding.reduce((sum, val) => sum + val * val, 0));

  const scored = chunks.map((chunk, index) => {
    const { content, embedding } = chunk;

    if (!Array.isArray(embedding) || embedding.length !== queryEmbedding.length) {
      console.error(`❌ Invalid chunk at index ${index}:`, chunk);
      return { text: content, score: 0 };
    }

    const dot = queryEmbedding.reduce((sum, val, i) => sum + val * embedding[i], 0);
    const magB = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    const score = magA && magB ? dot / (magA * magB) : 0;

    return { text: content, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((item) => item.text);
}
