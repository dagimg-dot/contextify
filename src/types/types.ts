import { Prompt } from "@/services/db";

export type MessageType = {
  type: "user" | "system" | "ai";
  content: string;
};

export interface GlobalState {
  currentPrompt: Prompt | null;
  currentStreamingContent: string | null;
  isStreaming: boolean;
  setCurrentStreamingContent: (content: string | null) => void;
  setIsStreaming: (isStreaming: boolean) => void;
  updateCurrentPrompt: (prompt: Prompt) => void;
}
