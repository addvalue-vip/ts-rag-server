
import { ingestDocument } from "../src/ingest";
import * as chunking from "../src/chunking";
import * as embedding from "../src/embedding";
import * as storage from "../src/storage";

describe("ingestDocument", () => {
  const mockChunks = ["Chunk 1", "Chunk 2"];
  const mockEmbedding = [0.1, 0.2, 0.3];

  beforeEach(() => {
    jest.spyOn(chunking, "splitTextIntoChunks").mockReturnValue(mockChunks);
    jest.spyOn(embedding, "embedText").mockResolvedValue(mockEmbedding);
    jest.spyOn(storage, "storeChunk").mockResolvedValue();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("splits, embeds, and stores all chunks for a document", async () => {
    await ingestDocument("doc123", "Raw document text");

    expect(chunking.splitTextIntoChunks).toHaveBeenCalledWith("Raw document text");
    expect(embedding.embedText).toHaveBeenCalledTimes(mockChunks.length);
    expect(storage.storeChunk).toHaveBeenCalledTimes(mockChunks.length);

    for (const chunk of mockChunks) {
      expect(embedding.embedText).toHaveBeenCalledWith(chunk);
      expect(storage.storeChunk).toHaveBeenCalledWith({
        doc_id: "doc123",
        chunk,
        embedding: mockEmbedding
      });
    }
  });
});
