import { embedText } from "./embedding";
import { fetchTopChunksBySimilarity, rankChunksBySimilarity } from "./retrieval";
import { buildPrompt } from "./prompt";
import { generateAnswer } from "./generateAnswer";
import { logError, logInfo } from "./logger";


export async function processQuery(query: string): Promise<string> {
  logInfo("🔧 processQuery started with:", query);

  try {
    const embedding = await embedText(query);
    logInfo("✅ Got embedding:", embedding?.length);

    const chunks = await fetchTopChunksBySimilarity(embedding);
    logInfo("📦 Got chunks:", chunks?.length);

    const relevantChunks = rankChunksBySimilarity(embedding, chunks);
    logInfo("🎯 Relevant chunks:", relevantChunks.length);

    if (!relevantChunks.length) {
      logInfo("⚠️ No relevant chunks found");
      return "No relevant information found.";
    }

    const prompt = buildPrompt(query, relevantChunks);
    logInfo("📜 Built prompt:", prompt.slice(0, 100)); // Truncate for log

    const answer = await generateAnswer(prompt);
    logInfo("🧠 Answer generated:", answer);

    return answer;
  } catch (err) {
    logError("❌ Error in processQuery:", err);
    return "An error occurred while processing your query.";
  }
}

