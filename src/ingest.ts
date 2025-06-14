
import { splitTextIntoChunks } from "./chunking";
import { embedText } from "./embedding";
import { logInfo } from "./logger";
import { storeChunk } from "./storage";

/**
 * Ingests a document by:
 * 1. Chunking its content
 * 2. Creating embeddings
 * 3. Storing in Supabase
 */
export async function ingestDocument(docId: string, text: string): Promise<void> {
  const chunks = splitTextIntoChunks(text);

  for (const chunk of chunks) {
    const embedding = await embedText(chunk);

    await storeChunk({
      doc_id: docId,
      chunk,
      embedding,
    });
  }

  logInfo(`✅ Document ${docId} processed (${chunks.length} chunks)`);
}
