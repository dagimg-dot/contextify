import useGlobalStore from "@/store";
import { getDecryptedKey } from "@/utils/cryptoHandler";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = await getDecryptedKey();
let geminiAPIKey = apiKey;

if (geminiAPIKey == "") {
  geminiAPIKey = import.meta.env.VITE_GEMINI_API_KEY;
  useGlobalStore.setState({ defaultKey: true });
}

const genAI = new GoogleGenerativeAI(geminiAPIKey);

export async function getAIResponse(input: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(input);
  const response = result.response;
  return response.text();
}
