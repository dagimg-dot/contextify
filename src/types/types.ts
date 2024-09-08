export type MessageType = {
  type: "user" | "system" | "ai";
  content: string;
};

export interface GlobalState {
  currentStreamingContent: string | null;
  isStreaming: boolean; 
  isLoading: boolean;
  defaultKey: boolean;
  currentConversationId: number | null;
  setIsLoading: (isLoading: boolean) => void;
  setCurrentConversationId: (id: number | null) => void;
  setCurrentStreamingContent: (content: string | null) => void;
  setIsStreaming: (isStreaming: boolean) => void;
}
