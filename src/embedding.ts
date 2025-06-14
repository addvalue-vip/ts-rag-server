import axios from "axios";
import { logInfo } from "./logger";

export async function embedText(input: string): Promise<number[]> {
  const response = await axios.post(
    "https://api.openai.com/v1/embeddings",
    {
      input,
      model: "text-embedding-ada-002"
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );
  console.log("🔎 Embedding text:", input);
  return response.data.data[0].embedding;
}
