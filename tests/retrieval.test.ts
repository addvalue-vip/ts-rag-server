
import { rankChunksBySimilarity, DocumentChunk } from "../src/retrieval";

describe("rankChunksBySimilarity", () => {
  const queryEmbedding = [1, 0];

  const chunks: DocumentChunk[] = [
    {
      content: "Chunk A", // cosine similarity = 1
      embedding: [1, 0],
    },
    {
      content: "Chunk B", // cosine similarity = 0
      embedding: [0, 1],
    },
    {
      content: "Chunk C", // cosine similarity ≈ 0.707
      embedding: [1, 1],
    },
  ];

  it("ranks chunks by descending cosine similarity", () => {
    const result = rankChunksBySimilarity(queryEmbedding, chunks, 3);
    expect(result).toEqual(["Chunk A", "Chunk C", "Chunk B"]);
  });

  it("respects the topK limit", () => {
    const result = rankChunksBySimilarity(queryEmbedding, chunks, 2);
    expect(result.length).toBe(2);
    expect(result).toEqual(["Chunk A", "Chunk C"]);
  });

  it("returns an empty array if chunks are empty", () => {
    const result = rankChunksBySimilarity(queryEmbedding, [], 3);
    expect(result).toEqual([]);
  });

  it("returns empty array if topK is 0", () => {
    const result = rankChunksBySimilarity(queryEmbedding, chunks, 0);
    expect(result).toEqual([]);
  });
});
