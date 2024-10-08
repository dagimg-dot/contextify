import { useEffect, useState } from "react";
import { seedDefaultConversation, seedDefaultPrompt } from "@/services/db";
import Header from "@/components/custom/Header";
import Chat from "@/components/custom/Chat";
import InputArea from "@/components/custom/InputArea";
import UserGuide from "@/components/custom/UserGuide";
import useGlobalStore from "@/store";

export default function Home() {
  const [showGuide, setShowGuide] = useState(false);
  const { setCurrentConversationId } = useGlobalStore();

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedContextDictionary");
    if (!hasVisited) {
      setShowGuide(true);
      localStorage.setItem("hasVisitedContextDictionary", "true");
      seedDefaultPrompt();
      seedDefaultConversation();
    }
    setCurrentConversationId(
      Number(localStorage.getItem("currentConversationId"))
    );
  }, [setCurrentConversationId]);

  return (
    <div className="flex flex-col h-dvh bg-background">
      <Header onShowGuide={() => setShowGuide(true)} />
      <Chat />
      <InputArea />
      <UserGuide open={showGuide} onOpenChange={setShowGuide} />
    </div>
  );
}
