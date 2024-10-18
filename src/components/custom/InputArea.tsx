import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { db } from "@/services/db";
import useGlobalStore from "@/store";
import { toast } from "sonner";
import { mergeInput } from "@/utils/inputMerger";
import { getAIResponse } from "@/services/api";
import { useLiveQuery } from "dexie-react-hooks";
import PromptPreview from "@/components/custom/PromptPreview";
import useTextSelection from "@/hooks/useSelection";

const InputArea = () => {
  const [input, setInput] = useState("");
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [finalPrompt, setFinalPrompt] = useState("");
  const selectedText = useTextSelection();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {
    currentConversationId: conversationId,
    setCurrentConversationId,
    isStreaming,
    setCurrentStreamingContent,
    setIsStreaming,
    isLoading,
    setIsLoading,
  } = useGlobalStore();

  const messages = useLiveQuery(
    () => db.messages.where("conversationId").equals(conversationId!).toArray(),
    [conversationId]
  );

  const currentPrompt = useLiveQuery(() =>
    db.prompts.where("isCurrent").equals(1).first()
  );

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
        const merged = await mergeInput(input, selectedText);
        setFinalPrompt(merged);
      } else {
        setFinalPrompt("");
      }
    };
    getFinalPrompt();
  }, [input, selectedText, currentPrompt]);

  const updateConversationTitle = useCallback(
    async (userMessage: string) => {
      // const newTitle =
      //   userMessage.trim().length > 20
      //     ? userMessage.slice(0, 20).concat("...")
      //     : userMessage;
      const newTitle = userMessage;

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

  const isNewConversation = useCallback(async () => {
    if (conversationId) {
      return (
        (
          await db.messages
            .where("conversationId")
            .equals(conversationId!)
            .toArray()
        ).length == 0
      );
    }

    return false;
  }, [conversationId]);

  const handleSend = useCallback(async () => {
    if (input.trim()) {
      if (!conversationId) {
        const conversations = await db.conversations.toArray();
        if (conversations.length > 0) {
          setCurrentConversationId(conversations[conversations.length - 1].id!);
          return;
        }
        toast.error(
          "Please select or create  a conversation to send a message"
        );
        return;
      }

      const userMessage = input.trim();
      const isNewConv = await isNewConversation();
      await updateConversationTitle(userMessage);
      await db.messages.add({
        conversationId,
        content: userMessage,
        type: "user",
        timestamp: new Date(),
      });
      setInput("");
      setIsLoading(true);
      setIsPreviewing(false);

      try {
        console.log("isNewConv", isNewConv);
        const response = await getAIResponse(finalPrompt, isNewConv);
        setIsStreaming(true);
        setCurrentStreamingContent(response);
      } catch (error) {
        if ((error as Error).message.includes("API key not valid")) {
          toast.error(
            "The API key is not valid. Please set a valid API key in the settings."
          );
        } else {
          toast.error("Error: " + (error as Error).message);
        }
      } finally {
        setIsLoading(false);
      }
    }
  }, [
    input,
    conversationId,
    setCurrentConversationId,
    finalPrompt,
    setCurrentStreamingContent,
    setIsStreaming,
    setIsLoading,
    updateConversationTitle,
    isNewConversation,
  ]);

  return (
    <footer className="py-4">
      <div className="relative flex items-center">
        <PromptPreview
          finalPrompt={finalPrompt}
          isPreviewing={isPreviewing}
          clearInput={() => setInput("")}
          selectedText={selectedText}
          setIsPreviewing={setIsPreviewing}
          textAreaRef={textareaRef}
        >
          <Textarea
            ref={textareaRef}
            placeholder={
              messages?.length ?? 0 > 0
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
            className="flex-1 min-h-[10px] h-[40px] max-h-60 transition-all duration-200 pr-12"
          />
        </PromptPreview>
        <div className="absolute right-2 bottom-2 flex space-x-2">
          <Button
            onClick={handleSend}
            size="icon"
            disabled={isLoading || isStreaming || input.trim() === ""}
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
