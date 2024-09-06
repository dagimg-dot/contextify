import { Prompt } from "@/services/db";
import { GlobalState } from "@/types/types";
import { create } from "zustand";

const initialState: GlobalState = {
  currentPrompt: null,
  currentStreamingContent: null,
  isStreaming: false,
  currentConversationId: null,
  updateCurrentPrompt: () => {},
  setCurrentStreamingContent: () => {},
  setIsStreaming: () => {},
  setCurrentConversationId: () => {},
};

const useGlobalStore = create<GlobalState>()((set) => ({
  ...initialState,
  updateCurrentPrompt: (prompt: Prompt) => set({ currentPrompt: prompt }),
  setCurrentStreamingContent: (content: string | null) => set({ currentStreamingContent: content }),
  setIsStreaming: (isStreaming: boolean) => set({ isStreaming }),
  setCurrentConversationId: (id: number | null) => set({ currentConversationId: id }),
}));

export default useGlobalStore;