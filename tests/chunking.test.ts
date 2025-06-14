
import { splitTextIntoChunks } from "../src/chunking";

describe("Text Chunking", () => {
  it("splits long text into multiple chunks", () => {
    const text = "Sentence one. Sentence two. Sentence three.";
    const chunks = splitTextIntoChunks(text, 30);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.every(c => c.length <= 30)).toBe(true);
  });

  it("returns single chunk for short text", () => {
    const chunks = splitTextIntoChunks("Short one.", 100);
    expect(chunks).toEqual(["Short one."]);
  });
});
