/**
 * Splits a given text into manageable chunks for embedding or retrieval.
 * Designed to handle a variety of data types: natural language text, code, CSV, and JSON.
 * 
 * @param text - Raw input text from any source or file type.
 * @param maxChunkSize - Maximum number of characters per chunk.
 * @param overlap - Number of overlapping sentences/lines between chunks to preserve context.
 * @returns Array of string chunks
 */
export function splitTextIntoChunks(
  text: string,
  maxChunkSize = 500,
  overlap = 1
): string[] {
  if (!text || typeof text !== "string") return [];

  let units: string[] = [];

  // Attempt natural language sentence splitting first
  const sentenceSplit = text.match(/[^.!?]+[.!?]+[\])'"`’”]*|\s*$/g);
  if (sentenceSplit && sentenceSplit.length > 1) {
    units = sentenceSplit;
  } else {
    // Fallback: if not natural text (e.g. code, logs, csv), split by lines
    units = text.split(/\r?\n/).filter(line => line.trim().length > 0);
  }

  const chunks: string[] = [];
  let currentChunk: string[] = [];

  for (let i = 0; i < units.length; i++) {
    const unit = units[i];
    const nextChunk = currentChunk.concat(unit).join(" ").trim();

    if (nextChunk.length <= maxChunkSize) {
      currentChunk.push(unit);
    } else {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.join(" ").trim());

        // Preserve overlap to maintain context
        currentChunk = currentChunk.slice(-overlap);
      }

      // If the unit is too large by itself, split it hard (fallback)
      if (unit.length > maxChunkSize) {
        for (let j = 0; j < unit.length; j += maxChunkSize - overlap) {
          chunks.push(unit.slice(j, j + maxChunkSize));
        }
        currentChunk = []; // Start fresh
      } else {
        currentChunk.push(unit);
      }
    }
  }

  // Push the last remaining chunk
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(" ").trim());
  }

  return chunks;
}
