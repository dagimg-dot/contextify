import React, { useCallback, useEffect } from "react";
import { db, seedDefaultPrompt } from "@/services/db";
import Header from "@/components/custom/Header";
import Chat from "@/components/custom/Chat";
import InputArea from "@/components/custom/InputArea";
import UserGuide from "@/components/custom/UserGuide";
import useGlobalStore from "@/store";

export default function Home() {
  const [showGuide, setShowGuide] = React.useState(false);
  const { currentConversationId, setCurrentConversationId } = useGlobalStore();

  const initializeConversation = useCallback(() => {
    async () => {
      const conversation = await db.conversations.add({
        title: "New Conversation",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastMessagePreview: "Welcome to Contextify!",
      });
      setCurrentConversationId(conversation);
      await db.messages.add({
        conversationId: conversation,
        content:
          "Welcome to Contextify! Enter a word and its context to get an explanation.",
        type: "system",
        timestamp: new Date(),
      });
    };
  }, [setCurrentConversationId]);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedContextDictionary");
    if (!hasVisited) {
      setShowGuide(true);
      localStorage.setItem("hasVisitedContextDictionary", "true");
      seedDefaultPrompt();
    }
    initializeConversation();
  }, [initializeConversation]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header onShowGuide={() => setShowGuide(true)} />
      <Chat conversationId={currentConversationId} />
      <InputArea conversationId={currentConversationId} />
      <UserGuide open={showGuide} onOpenChange={setShowGuide} />
    </div>
  );
}
