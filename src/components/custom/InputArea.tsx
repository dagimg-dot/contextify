import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Send } from "lucide-react";
import { db } from "@/services/db";
import useGlobalStore from "@/store";
import { toast } from "sonner";
import { mergeInput } from "@/utils/inputMerger";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const InputArea = () => {
  const [input, setInput] = useState("");
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [finalPrompt, setFinalPrompt] = useState("");
  const textareaRef: React.RefObject<HTMLTextAreaElement> = useRef(null);
  const {
    currentConversationId: conversationId,
    isStreaming,
    setCurrentStreamingContent,
    setIsStreaming,
  } = useGlobalStore();

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
    const getFinalPrompt = async () => {
      if (input.trim()) {
        const merged = await mergeInput(input);
        setFinalPrompt(merged);
      } else {
        setFinalPrompt("");
      }
    };
    getFinalPrompt();
  }, [input]);

  const updateConversationTitle = useCallback(
    async (userMessage: string) => {
      const newTitle =
        userMessage.trim().length > 20
          ? userMessage.slice(0, 20).concat("...")
          : userMessage;

      const conversation = await db.conversations
        .where("id")
        .equals(conversationId!)
        .first();
      if (conversationId && conversation?.title === "New Conversation") {
        await db.conversations.update(conversationId, {
          title: newTitle,
        });
      }
    },
    [conversationId]
  );

  const handleSend = useCallback(async () => {
    if (input.trim()) {
      if (!conversationId) {
        toast.error("Please select a conversation to send a message");
        return;
      }

      const userMessage = input.trim();
      updateConversationTitle(userMessage);

      await db.messages.add({
        conversationId,
        content: userMessage,
        type: "user",
        timestamp: new Date(),
      });
      setInput("");
      setIsStreaming(true);

      // Simulate AI response
      setTimeout(() => {
        const aiResponse = finalPrompt;
        setCurrentStreamingContent(aiResponse);
      }, 1000);
    }
  }, [
    input,
    conversationId,
    setCurrentStreamingContent,
    setIsStreaming,
    updateConversationTitle,
    finalPrompt,
  ]);

  const handlePreview = useCallback(() => {
    setIsPreviewing(true);
  }, []);

  return (
    <>
      <footer className="p-4 border-t">
        <div className="relative flex items-center">
          <Textarea
            ref={textareaRef}
            placeholder="Enter a word and its context..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="flex-1 min-h-[10px] h-[40px] max-h-60 transition-all duration-200 overflow-hidden pr-12"
            style={{ paddingRight: "4rem" }} // Provide space for the buttons
          />
          <div className="absolute right-2 bottom-2 flex space-x-2">
            <Button
              onClick={handlePreview}
              size="icon"
              disabled={isStreaming || input.trim() === ""}
            >
              <Eye className="w-4 h-4" />{" "}
              <span className="sr-only">Preview</span>
            </Button>
            <Button onClick={handleSend} size="icon" disabled={isStreaming}>
              <Send className="w-4 h-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </footer>

      <Dialog open={isPreviewing} onOpenChange={setIsPreviewing}>
        <DialogContent className="max-w-[370px] rounded-md">
          <DialogHeader>
            <DialogTitle>Preview</DialogTitle>
            <DialogDescription>
              Here's how your input will be transformed into a prompt:
            </DialogDescription>
          </DialogHeader>
          <div className="border p-2 rounded-md">
            <p className="text-sm">{finalPrompt}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InputArea;
