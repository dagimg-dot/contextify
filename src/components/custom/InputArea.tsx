import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { db } from "@/services/db";
import useGlobalStore from "@/store";
import { toast } from "sonner";

interface InputAreaProps {
  conversationId: number | null;
}

const InputArea = ({ conversationId }: InputAreaProps) => {
  const [input, setInput] = useState("");
  const textareaRef: React.RefObject<HTMLTextAreaElement> = useRef(null);
  const { isStreaming, setCurrentStreamingContent, setIsStreaming } =
    useGlobalStore();

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [input]);

  const handleSend = useCallback(async () => {
    if (input.trim()) {
      if (!conversationId) {
        toast.error("Please select a conversation to send a message");
        return;
      }

      const userMessage = input.trim();
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
        const aiResponse = `Here's an explanation for "${userMessage}". It's a bit long, so I'm going to break it up into multiple parts.`;
        setCurrentStreamingContent(aiResponse);
      }, 1000);
    }
  }, [input, conversationId, setCurrentStreamingContent, setIsStreaming]);

  return (
    <footer className="p-4 border-t">
      <div className="flex items-center space-x-2">
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
          className="flex-1 min-h-[10px] h-[20px] max-h-60 transition-all duration-200 overflow-hidden"
        />
        <Button onClick={handleSend} size="icon" disabled={isStreaming}>
          <Send className="w-4 h-4" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </footer>
  );
};

export default InputArea;
