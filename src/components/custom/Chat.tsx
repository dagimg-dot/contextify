import { useRef, useEffect } from "react";
import Message from "@/components/custom/Message";
import StreamingMessage from "@/components/custom/StreamingMessage";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/services/db";
import useGlobalStore from "@/store";
import { MessageType } from "@/types/types";

const Chat = () => {
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const {
    currentConversationId: conversationId,
    currentStreamingContent,
    isStreaming,
    isLoading,
    setCurrentStreamingContent,
    setIsStreaming,
  } = useGlobalStore();

  const messages = useLiveQuery(
    () =>
      db.messages
        .where("conversationId")
        .equals(conversationId || 0)
        .toArray(),
    [conversationId]
  );

  const defaultMessage: MessageType = {
    type: "system",
    content:
      "Welcome to Contextify! Enter a word and its context to get an explanation.",
  };

  const loadingMessage: MessageType = {
    type: "system",
    content: "Loading...",
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, currentStreamingContent]);

  const handleStreamingComplete = async (content: string) => {
    if (conversationId) {
      await db.messages.add({
        conversationId,
        content,
        type: "ai",
        timestamp: new Date(),
      });
      setCurrentStreamingContent(null);
      setIsStreaming(false);
    }
  };

  return (
    <main className="flex-1 overflow-hidden mt-3">
        <Message message={defaultMessage} />
        {messages?.map((message, index) => (
          <Message key={index} message={message} />
        ))}
        {isLoading && <Message message={loadingMessage} />}
        {isStreaming && currentStreamingContent && (
          <StreamingMessage
            content={currentStreamingContent}
            speed={15}
            onComplete={handleStreamingComplete}
          />
        )}
    </main>
  );
};

export default Chat;
