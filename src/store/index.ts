import { GlobalState } from "@/types/types";
import { create } from "zustand";
import { useMediaQuery } from "react-responsive";

const initialState: GlobalState = {
  currentStreamingContent: null,
  isStreaming: false,
  isLoading: false,
  defaultKey: false,
  chatSession: null,
  currentConversationId: null,
  setIsLoading: () => {},
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
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
}));

export const useIsMobile = () => useMediaQuery({ maxWidth: 850 });

export default useGlobalStore;
