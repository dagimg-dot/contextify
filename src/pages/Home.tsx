import { useEffect, useState } from "react";
import { seedDefaultConversation, seedDefaultPrompt } from "@/services/db";
import Header from "@/components/custom/Header";
import Chat from "@/components/custom/Chat";
import InputArea from "@/components/custom/InputArea";
import UserGuide from "@/components/custom/UserGuide";
import useGlobalStore, { useIsMobile } from "@/store";
import HistoryDrawer from "@/components/custom/Drawer";

export default function Home() {
  const [showGuide, setShowGuide] = useState(false);
  const { setCurrentConversationId } = useGlobalStore();
  const isMobile = useIsMobile();

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
    <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] h-dvh bg-background overflow-hidden">
      {!isMobile && (
        <div className="row-span-2 border-r">
          <HistoryDrawer onShowGuide={() => setShowGuide(true)} />
        </div>
      )}
      <div className="col-start-2 h-18">
        <Header onShowGuide={() => setShowGuide(true)} />
      </div>
      <div className="col-start-2 row-start-2 overflow-y-auto flex justify-center">
        <div className="w-full max-w-3xl flex flex-col h-full">
          <div className="flex-1">
            <Chat />
          </div>
          <div className="sticky bottom-0 bg-background">
            <InputArea />
          </div>
        </div>
      </div>
      <UserGuide open={showGuide} onOpenChange={setShowGuide} />
    </div>
  );
}
