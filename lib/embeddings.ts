import { genAI } from "./langchain";

export async function generateEmbedding(text: string) {
  const result = await genAI.models.embedContent({
    model: "gemini-3-flash-preview",
    content: text,
  });

  return result.embedding.values; // ✅ 768 dimensions
}