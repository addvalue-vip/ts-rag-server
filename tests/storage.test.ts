import { storeChunk } from "../src/storage";
import { createClient } from "@supabase/supabase-js";

// Create mocks
const insertMock = jest.fn();
const fromMock = jest.fn(() => ({ insert: insertMock }));
const createClientMock = jest.fn(() => ({ from: fromMock }));

// Mock the Supabase module
jest.mock("@supabase/supabase-js", () => ({
  createClient: createClientMock,
}));

describe("storeChunk", () => {
  const record = {
    doc_id: "doc_001",
    chunk: "Example chunk text.",
    embedding: [0.1, 0.2, 0.3],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("inserts chunk and embedding successfully", async () => {
    insertMock.mockResolvedValueOnce({ error: null });

    await expect(storeChunk(record)).resolves.toBeUndefined();

    expect(fromMock).toHaveBeenCalledWith("chunks");
    expect(insertMock).toHaveBeenCalledWith({
      doc_id: record.doc_id,
      content: record.chunk,
      embedding: record.embedding,
    });
  });

  it("throws an error on insert failure", async () => {
    const errorMessage = "Insert failed";
    insertMock.mockResolvedValueOnce({ error: { message: errorMessage } });

    await expect(storeChunk(record)).rejects.toThrow(`Supabase insert failed: ${errorMessage}`);
  });
});
