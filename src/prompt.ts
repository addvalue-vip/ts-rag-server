
export function buildPrompt(userQuery: string, contextChunks: string[]): string {
  const context = contextChunks.length
    ? contextChunks.join("\n\n")
    : "[No relevant context found]";

  return `You are an intelligent assistant. Use the context below to answer the user's question.

Context:
${context}

Question:
${userQuery}

Answer:`;
}

