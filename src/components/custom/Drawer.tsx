import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Menu, HelpCircle, Plus, ChevronRight } from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, Conversation } from "@/services/db";
import useGlobalStore from "@/store";

interface HistoryDrawerProps {
  onShowGuide: () => void;
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ onShowGuide }) => {
  const [searchHistory, setSearchHistory] = useState("");
  const { setCurrentConversationId } = useGlobalStore();

  const conversations = useLiveQuery(() =>
    db.conversations.orderBy("updatedAt").reverse().toArray()
  );

  const filteredConversations = conversations?.filter((c) =>
    c.title.toLowerCase().includes(searchHistory.toLowerCase())
  );

  const createNewConversation = async () => {
    const newConversationId = await db.conversations.add({
      title: "New Conversation",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastMessagePreview: "Start a new conversation",
    });
    setCurrentConversationId(newConversationId);
  };

  const selectConversation = (conversation: Conversation) => {
    setCurrentConversationId(conversation.id!);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="w-5 h-5" />
          <span className="sr-only">History</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader className="flex flex-row items-center justify-between space-y-0 mb-4">
          <SheetTitle>History</SheetTitle>
          <div>
            <Button
              variant="outline"
              size="icon"
              onClick={onShowGuide}
              className="mr-2"
            >
              <HelpCircle className="w-5 h-5" />
              <span className="sr-only">Help</span>
            </Button>
            <SheetClose asChild>
              <Button variant="outline" size="icon">
                <ChevronRight className="w-5 h-5" />
                <span className="sr-only">Close</span>
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>
        <div className="flex flex-col space-y-4">
          <Button onClick={createNewConversation} className="w-full">
            <Plus className="w-4 h-4 mr-2" /> New Conversation
          </Button>
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchHistory}
            onChange={(e) => setSearchHistory(e.target.value)}
            className="w-full"
          />
        </div>
        <ScrollArea className="h-[calc(100vh-12rem)] mt-4">
          {filteredConversations?.map((conversation) => (
            <Card
              key={conversation.id}
              className="mb-2 cursor-pointer hover:bg-accent"
              onClick={() => selectConversation(conversation)}
            >
              <CardHeader className="py-2">
                <CardTitle className="text-sm">{conversation.title}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {conversation.lastMessagePreview}
                </p>
              </CardHeader>
            </Card>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default HistoryDrawer;
