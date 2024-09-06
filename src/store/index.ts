import { GlobalState } from "@/types/types";
import { create } from "zustand";

const initialState: GlobalState = {
  currentStreamingContent: null,
  isStreaming: false,
  currentConversationId: null,
  setCurrentStreamingContent: () => {},
  setIsStreaming: () => {},
  setCurrentConversationId: () => {},
};

const useGlobalStore = create<GlobalState>()((set) => ({
  ...initialState,
  setCurrentStreamingContent: (content: string | null) =>
    set({ currentStreamingContent: content }),
  setIsStreaming: (isStreaming: boolean) => set({ isStreaming }),
  setCurrentConversationId: (id: number | null) => {
    set({ currentConversationId: id });
    localStorage.setItem("currentConversationId", id!.toString());
  },
}));

export default useGlobalStore;
