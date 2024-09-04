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

export default function MainPage() {
  const [messages, setMessages] = useState([
    {
      type: "system",
      content:
        "Welcome to Context Dictionary! Enter a word and its context to get an explanation.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState("");
  const [showGuide, setShowGuide] = useState(false);
  const scrollAreaRef = useRef(null);
  const streamIntervalRef = useRef(null);
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
  }, [messages, streamedContent]);

  const simulateStreaming = useCallback((content) => {
    setIsStreaming(true);
    setStreamedContent("");
    let index = 0;
    streamIntervalRef.current = setInterval(() => {
      if (index < content.length) {
        setStreamedContent((prev) => prev + content[index]);
        index++;
      } else {
        clearInterval(streamIntervalRef.current);
        setIsStreaming(false);
        setMessages((prev) => [...prev, { type: "ai", content }]);
        setStreamedContent("");
      }
    }, 10);
  }, []);

  const handleSend = useCallback(() => {
    if (input.trim()) {
      const userMessage = input;
      setMessages((prev) => [...prev, { type: "user", content: userMessage }]);
      setInput("");
      setTimeout(() => {
        simulateStreaming(`Here's an explanation for "${userMessage}":`);
      }, 100);
    }
  }, [input, simulateStreaming]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <Book className="w-6 h-6" />
          <h1 className="text-xl font-bold">Context Dictionary</h1>
        </div>
        <div className="flex items-center space-x-2">
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
          {isStreaming && <StreamingMessage content={streamedContent} />}
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
          <Button onClick={handleSend} size="icon" disabled={isStreaming}>
            <Send className="w-4 h-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </footer>
      <UserGuide open={showGuide} onOpenChange={setShowGuide} />
    </div>
  );
}
