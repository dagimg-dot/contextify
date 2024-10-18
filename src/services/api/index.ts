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

  if (geminiAPIKey == "") {
    geminiAPIKey = import.meta.env.VITE_GEMINI_API_KEY;
    useGlobalStore.setState({ defaultKey: true });
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
  if (!genAI) {
    await initializeGenAI();
  }

  if (!genAI) {
    throw new Error("Failed to initialize GoogleGenerativeAI");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  let chat: ChatSession;

  console.log("isNewChat", isNewChat)

  if (isNewChat) {
    console.log("new chat");
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
  // return "hello world";
}
