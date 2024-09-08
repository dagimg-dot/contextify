import { GoogleGenerativeAI } from "@google/generative-ai";
import { getDecryptedKey } from "@/utils/cryptoHandler";
import useGlobalStore from "@/store";

let genAI: GoogleGenerativeAI | null = null;

async function initializeGenAI() {
  const apiKey = await getDecryptedKey();
  let geminiAPIKey = apiKey;

  if (geminiAPIKey == "") {
    geminiAPIKey = import.meta.env.VITE_GEMINI_API_KEY;
    useGlobalStore.setState({ defaultKey: true });
  }

  genAI = new GoogleGenerativeAI(geminiAPIKey);
}

export async function getAIResponse(input: string): Promise<string> {
  if (!genAI) {
    await initializeGenAI();
  }

  if (!genAI) {
    throw new Error("Failed to initialize GoogleGenerativeAI");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(input);
  const response = result.response;
  return response.text();
}
