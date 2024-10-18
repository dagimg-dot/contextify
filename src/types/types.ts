import { ChatSession } from "@google/generative-ai";

export type MessageType = {
  type: "user" | "system" | "ai";
  content: string;
};

export interface GlobalState {
  currentStreamingContent: string | null;
  isStreaming: boolean; 
  isLoading: boolean;
  defaultKey: boolean;
  chatSession: ChatSession | null;
  currentConversationId: number | null;
  setIsLoading: (isLoading: boolean) => void;
  setCurrentConversationId: (id: number | null) => void;
  setCurrentStreamingContent: (content: string | null) => void;
  setIsStreaming: (isStreaming: boolean) => void;
}
