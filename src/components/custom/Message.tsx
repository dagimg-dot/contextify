import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageType } from "@/types/types";
import ReactMarkdown from "react-markdown";
import { Copy, CopyCheck, RefreshCcw } from "lucide-react";
import useHover from "@/hooks/useHover";
import { toast } from "sonner";

interface MessageProps {
  message: MessageType;
}

const Message = React.memo(({ message }: MessageProps) => {
  const [hoverRef, isHovered] = useHover<HTMLDivElement>();
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboardMain = (text: string) => {
    return navigator.clipboard.writeText(text).then(
      () => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        toast.success("Copied to clipboard!");
      },
      (err) => {
        toast.error("Failed to copy: ", err);
      }
    );
  };

  const copyToClipboardFallback = (text: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (successful) {
        setCopySuccess(true);
        toast.success("Copied to clipboard!");
      } else {
        throw new Error("Failed to copy to clipboard");
      }
    } catch (error) {
      setCopySuccess(false);
      toast.error("Failed to copy to clipboard. Please try again.");
    } finally {
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      copyToClipboardMain(text).catch(() => copyToClipboardFallback(text));
    } else {
      copyToClipboardFallback(text);
    }
  };

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
