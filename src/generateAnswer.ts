
import axios from "axios";
import { logInfo } from "./logger";

export async function generateAnswer(prompt: string): Promise<string> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not defined in environment variables.");
    }

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant. If unsure, state that you don't know.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.1,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Log entire response for debugging
    console.log(JSON.stringify(response.data, null, 2));

    const message = response.data?.choices?.[0]?.message?.content;
    const safeMessage = message || "No answer available.";

    logInfo(safeMessage);
    return safeMessage;
  } catch (error: any) {
    console.error("Error generating answer:", error.response?.data || error.message);
    return "An error occurred while generating the answer.";
  }
}

