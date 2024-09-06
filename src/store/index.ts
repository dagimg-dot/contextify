import { Prompt } from "@/services/db";
import { GlobalState } from "@/types/types";
import { create } from "zustand";

const initialState: GlobalState = {
  currentPrompt: null,
  currentStreamingContent: null,
  isStreaming: false,
  updateCurrentPrompt: () => {},
  setCurrentStreamingContent: () => {},
  setIsStreaming: () => {},
};

const useGlobalStore = create<GlobalState>()((set) => ({
  ...initialState,
  updateCurrentPrompt: (prompt: Prompt) => set({ currentPrompt: prompt }),
  setCurrentStreamingContent: (content: string | null) =>
    set({ currentStreamingContent: content }),
  setIsStreaming: (isStreaming: boolean) => set({ isStreaming }),
}));

export default useGlobalStore;
