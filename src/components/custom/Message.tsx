import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageType } from "@/types/types";
import ReactMarkdown from "react-markdown"; // Import react-markdown

interface MessageProps {
  message: MessageType;
}

const Message = React.memo(({ message }: MessageProps) => (
  <div
    className={`flex ${
      message.type === "user" ? "justify-end" : "justify-start"
    } mb-4`}
  >
    <Card
      className={`max-w-[80%] ${message.type === "system" ? "bg-muted" : ""}`}
    >
      <CardContent className="p-3">
        <ReactMarkdown className="text-left">{message.content}</ReactMarkdown>
      </CardContent>
    </Card>
  </div>
));

export default Message;

