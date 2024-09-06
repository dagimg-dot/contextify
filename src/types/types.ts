import { Prompt } from "@/services/db";

export type MessageType = {
  type: "user" | "system" | "ai";
  content: string;
};

export interface GlobalState {
  currentPrompt: Prompt | null;
  updateCurrentPrompt: (prompt: Prompt) => void;
}
