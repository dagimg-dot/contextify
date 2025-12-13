import {
  ChatSession,
  GenerativeModel,
  GoogleGenerativeAI,
} from "@google/generative-ai";
import { getDecryptedKey } from "@/utils/cryptoHandler";
import useGlobalStore from "@/store";
import { toast } from "sonner";

let genAI: GoogleGenerativeAI | null = null;

async function initializeGenAI() {
  const apiKey = await getDecryptedKey();
  let geminiAPIKey = apiKey;

  if (geminiAPIKey == "" || !geminiAPIKey) {
    geminiAPIKey = import.meta.env.VITE_GEMINI_API_KEY;
    useGlobalStore.setState({ defaultKey: true });
  }

  // Validate that we have a valid API key before initializing
  if (!geminiAPIKey || geminiAPIKey.trim() === "") {
    const errorMessage = "API key not found. Please set your Gemini API key in Settings or configure VITE_GEMINI_API_KEY environment variable.";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }

  genAI = new GoogleGenerativeAI(geminiAPIKey);
}

const newChat = (model: GenerativeModel) => {
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Hello, my english tutor!" }],
      },
      {
        role: "model",
        parts: [{ text: "Hello student! How can I assist you today?" }],
      },
    ],
  });

  return chat;
};

export async function getAIResponse(
  input: string,
  isNewChat = false
): Promise<string> {
  try {
    if (!genAI) {
      await initializeGenAI();
    }

    if (!genAI) {
      throw new Error("Failed to initialize GoogleGenerativeAI");
    }

    // Use gemini-pro (most stable and widely available model)
    // Alternative models: gemini-1.5-pro, gemini-1.5-flash
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });
    let chat: ChatSession;

    if (isNewChat) {
      chat = newChat(model);
      useGlobalStore.setState({ chatSession: chat });
    }

    chat = useGlobalStore.getState().chatSession!;

    if (!chat) {
      toast.error("Chat session not found");
      chat = newChat(model);
    }

    const result = await chat.sendMessage(input);
    const response = result.response;
    return response.text();
  } catch (error: any) {
    // Handle API key errors specifically
    if (error?.message?.includes("API Key") || error?.message?.includes("API_KEY")) {
      const errorMessage = "Invalid or missing API key. Please check your API key in Settings.";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
    // Handle model not found errors
    if (error?.message?.includes("not found") || error?.message?.includes("404")) {
      const errorMessage = "Model not found. The model may have been deprecated. Please check Google AI documentation for available models.";
      toast.error(errorMessage);
      console.error("Model error details:", error);
      throw new Error(errorMessage);
    }
    // Re-throw other errors
    throw error;
  }
  // return "hello world";
}
