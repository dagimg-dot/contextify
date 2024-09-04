import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Book, Settings, Send } from "lucide-react";
import Message from "@/components/custom/Message";
import StreamingMessage from "@/components/custom/StreamingMessage";
import Drawer from "@/components/custom/Drawer";
import UserGuide from "@/components/custom/UserGuide";
import { MessageType } from "@/types/types";
import { ThemeToggle } from "@/components/custom/ThemeToggle";

export default function Home() {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      type: "system",
      content:
        "Welcome to Contextify! Enter a word and its context to get an explanation.",
    },
  ]);
  const [input, setInput] = useState("");
  const [currentStreamingContent, setCurrentStreamingContent] = useState<
    string | null
  >(null);
  const [showGuide, setShowGuide] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedContextDictionary");
    if (!hasVisited) {
      setShowGuide(true);
      localStorage.setItem("hasVisitedContextDictionary", "true");
    }
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, currentStreamingContent]);

  const handleSend = useCallback(() => {
    if (input.trim()) {
      const userMessage = input;
      setMessages((prev) => [...prev, { type: "user", content: userMessage }]);
      setInput("");
      setTimeout(() => {
        const aiResponse = `Here's an explanation for "${userMessage}". It's a bit long, so I'm going to break it up into multiple parts.`;
        setCurrentStreamingContent(aiResponse);
      }, 100);
    }
  }, [input]);

  const handleStreamingComplete = useCallback((content: string) => {
    setMessages((prev) => [...prev, { type: "ai", content }]);
    setCurrentStreamingContent(null);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <Book className="w-6 h-6" />
          <h1 className="text-xl font-bold">Contextify</h1>
        </div>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/settings")}
          >
            <Settings className="w-5 h-5" />
            <span className="sr-only">Settings</span>
          </Button>
          <Drawer messages={messages} onShowGuide={() => setShowGuide(true)} />
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          {messages.map((message, index) => (
            <Message key={index} message={message} />
          ))}
          {currentStreamingContent && (
            <StreamingMessage
              content={currentStreamingContent}
              speed={10}
              onComplete={handleStreamingComplete}
            />
          )}
        </ScrollArea>
      </main>
      <footer className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <Textarea
            placeholder="Enter a word and its context..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="flex-1"
            rows={1}
          />
          <Button
            onClick={handleSend}
            size="icon"
            disabled={!!currentStreamingContent}
          >
            <Send className="w-4 h-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </footer>
      <UserGuide open={showGuide} onOpenChange={setShowGuide} />
    </div>
  );
}
