import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageType } from "@/types/types";
import ReactMarkdown from "react-markdown";
import { Copy, CopyCheck, RefreshCcw } from "lucide-react";
import useHover from "@/hooks/useHover";
import useClipboard from "@/hooks/useClipboard";

interface MessageProps {
  message: MessageType;
}

const Message = React.memo(({ message }: MessageProps) => {
  const [hoverRef, isHovered] = useHover<HTMLDivElement>();
  const { copyToClipboard, copySuccess } = useClipboard();

  return (
    <div
      className={`flex items-end gap-2 ${
        message.type === "user" ? "flex-row-reverse" : "justify-start"
      } mb-4`}
      ref={hoverRef}
    >
      <Card
        className={`max-w-[80%] ${
          ["system", "ai"].includes(message.type) ? "bg-muted" : ""
        }`}
      >
        <CardContent className="p-3">
          <ReactMarkdown className="text-left">{message.content}</ReactMarkdown>
        </CardContent>
      </Card>
      {isHovered && (
        <div className="flex flex-col gap-1 mb-2">
          {message.type === "user" && <RefreshCcw size="18" />}
          {message.type === "ai" && (
            <button onClick={() => copyToClipboard(message.content)}>
              {copySuccess ? (
                <CopyCheck size="18" color="green" />
              ) : (
                <Copy size="18" />
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
});

export default Message;
