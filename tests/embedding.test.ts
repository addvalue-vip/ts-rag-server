
import axios from "axios";
import { embedText } from "../src/embedding";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Embedding", () => {
  it("returns embedding vector", async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        data: [{ embedding: [0.1, 0.2, 0.3] }]
      }
    });

    const result = await embedText("test");
    expect(result).toEqual([0.1, 0.2, 0.3]);
  });
});
