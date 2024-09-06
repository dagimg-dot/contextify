export type MessageType = {
  type: "user" | "system" | "ai";
  content: string;
};

export interface GlobalState {
  currentStreamingContent: string | null;
  isStreaming: boolean;
  currentConversationId: number | null;
  setCurrentConversationId: (id: number | null) => void;
  setCurrentStreamingContent: (content: string | null) => void;
  setIsStreaming: (isStreaming: boolean) => void;
}
