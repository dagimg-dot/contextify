import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useStreaming } from "@/hooks/useStreaming";

interface StreamingMessageProps {
  content: string;
  speed?: number;
  onComplete: (content: string) => void;
}

const StreamingMessage: React.FC<StreamingMessageProps> = ({
  content,
  speed = 10,
  onComplete,
}) => {
  const { streamedContent, isStreaming } = useStreaming(
    content,
    speed,
    onComplete
  );

  if (!isStreaming && streamedContent === content) {
    return null;
  }

  return (
    <div className="flex justify-start mb-4">
      <Card className="max-w-[80%]">
        <CardContent className="p-3">
          <p className="text-left">{streamedContent}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default React.memo(StreamingMessage);
