import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { db } from "@/services/db";
import useGlobalStore from "@/store";
import { toast } from "sonner";
import { mergeInput } from "@/utils/inputMerger";
import { useAIQuery } from "@/services/api/useAPIQuery";
import { useLiveQuery } from "dexie-react-hooks";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const InputArea = () => {
  const [input, setInput] = useState("");
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [finalPrompt, setFinalPrompt] = useState("");
  const { data, error, refetch } = useAIQuery(finalPrompt);
  const textareaRef: React.RefObject<HTMLTextAreaElement> = useRef(null);
  const {
    currentConversationId: conversationId,
    isStreaming,
    setCurrentStreamingContent,
    setIsStreaming,
    setIsLoading,
  } = useGlobalStore();

  const messages = useLiveQuery(
    () => db.messages.where("conversationId").equals(conversationId!).toArray(),
    [conversationId]
  );

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (data) {
      setCurrentStreamingContent(data);
      console.log("data", data);
    }
  }, [data, setCurrentStreamingContent]);

  useEffect(() => {
    if (error) {
      console.error("Error:", error);
      toast.error(`Error: ${error.message}`);
    }
  }, [error]);

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
      setIsLoading(true);

      const result = await refetch();

      if (result.data) {
        setCurrentStreamingContent(result.data);
        console.log("data", result.data);
      }

      if (result.error) {
        toast.error("Error: " + result.error);
      }

      setIsLoading(false);
    }
  }, [
    input,
    conversationId,
    setCurrentStreamingContent,
    setIsStreaming,
    updateConversationTitle,
    refetch,
    setIsLoading,
  ]);

  useEffect(() => {
    if (input.trim() !== "") {
      setIsPreviewing(true);
      textareaRef.current?.focus();
    } else {
      setIsPreviewing(false);
    }
  }, [input]);

  return (
    <footer className="p-4 border-t">
      <div className="relative flex items-center">
        <Popover open={isPreviewing}>
          <PopoverTrigger asChild>
            <div className="w-full">
              <Textarea
                ref={textareaRef}
                placeholder={
                  messages?.length > 0
                    ? "Ask a follow-up question..."
                    : "Enter a word and its context..."
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="flex-1 min-h-[10px] h-[40px] max-h-60 transition-all duration-200 overflow-hidden pr-12"
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80 mb-4" side="top">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Preview</h4>
              <p className="text-sm text-muted-foreground">
                Here's how your input will be transformed into a prompt:
              </p>
              <div className="border p-2 rounded-md">
                <p className="text-sm">{finalPrompt}</p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <div className="absolute right-2 bottom-2 flex space-x-2">
          <Button
            onClick={handleSend}
            size="icon"
            disabled={isStreaming || input.trim() === ""}
          >
            <Send className="w-4 h-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default InputArea;
