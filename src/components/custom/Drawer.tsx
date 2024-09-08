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
import { HelpCircle, Plus, ChevronRight, Trash2, History } from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, Conversation } from "@/services/db";
import useGlobalStore from "@/store";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface HistoryDrawerProps {
  onShowGuide: () => void;
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ onShowGuide }) => {
  const [openSheet, setOpenSheet] = useState(false);
  const [searchHistory, setSearchHistory] = useState("");
  const [conversationToDelete, setConversationToDelete] =
    useState<Conversation | null>(null);
  const { currentConversationId, setCurrentConversationId, defaultKey } =
    useGlobalStore();

  const conversations = useLiveQuery(() =>
    db.conversations.orderBy("updatedAt").reverse().toArray()
  );

  const filteredConversations = conversations?.filter((c) =>
    c.title.toLowerCase().includes(searchHistory.toLowerCase())
  );

  const createNewConversation = async () => {
    const conversationCount = await db.conversations.count();
    if (conversationCount > 3 && defaultKey) {
      toast.error(
        "I see you are liking this app. Please set your API key in the settings, you are using mine! 🙂"
      );
    }

    const newConversationId = await db.conversations.add({
      title: "New Conversation",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastMessagePreview: "Start a new conversation",
    });
    setCurrentConversationId(newConversationId);
    setOpenSheet(false);
  };

  const selectConversation = (conversation: Conversation) => {
    setCurrentConversationId(conversation.id!);
    setOpenSheet(false);
  };

  const deleteConversation = async (id: number) => {
    try {
      await db.conversations.delete(id);
      await db.messages.where("conversationId").equals(id).delete();
    } catch (error) {
      toast.error("Failed to delete conversation");
    }
  };

  const handleDeleteConversation = async () => {
    if (conversationToDelete) {
      await deleteConversation(conversationToDelete.id!);
      setConversationToDelete(null);

      if (conversationToDelete.id === currentConversationId) {
        const remainingConversations = conversations?.filter(
          (c) => c.id !== conversationToDelete.id
        );
        if (remainingConversations && remainingConversations.length > 0) {
          setCurrentConversationId(remainingConversations[0].id!);
        } else {
          createNewConversation();
        }
      }

      toast.success("The conversation has been successfully deleted.");
    }
  };

  return (
    <>
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpenSheet(true)}
          >
            <History className="w-5 h-5" />
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
                className={`mb-2 cursor-pointer hover:bg-accent ${
                  conversation.id === currentConversationId
                    ? "border-primary"
                    : ""
                }`}
              >
                <CardHeader className="py-2 flex flex-row items-center justify-between">
                  <div
                    onClick={() => selectConversation(conversation)}
                    className="flex-1"
                  >
                    <CardTitle className="text-sm">
                      {conversation.title.length > 20
                        ? conversation.title.slice(0, 20).concat("...")
                        : conversation.title}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {conversation.createdAt.toUTCString().replace("GMT", "")}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setConversationToDelete(conversation);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="sr-only">Delete conversation</span>
                  </Button>
                </CardHeader>
              </Card>
            ))}
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <Dialog
        open={!!conversationToDelete}
        onOpenChange={(open) => !open && setConversationToDelete(null)}
      >
        <DialogContent className="max-w-[370px] rounded-md">
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this conversation?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              conversation and all its messages.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-3">
            <Button variant="destructive" onClick={handleDeleteConversation}>
              Delete
            </Button>
            <Button
              variant="outline"
              onClick={() => setConversationToDelete(null)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HistoryDrawer;
