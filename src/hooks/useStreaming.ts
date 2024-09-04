import { useState, useEffect, useRef, useCallback } from "react";

export function useStreaming(
  content: string,
  speed: number = 10,
  onComplete: (content: string) => void
) {
  const [streamedContent, setStreamedContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startStreaming = useCallback(() => {
    setIsStreaming(true);
    setStreamedContent("");
    let index = -1;

    streamIntervalRef.current = setInterval(() => {
      if (index < content.length - 1) {
        setStreamedContent((prev) => prev + content[index]);
        index++;
      } else {
        if (streamIntervalRef.current) {
          clearInterval(streamIntervalRef.current);
        }
        setIsStreaming(false);
        onComplete(content);
      }
    }, speed);
  }, [content, speed, onComplete]);

  useEffect(() => {
    startStreaming();
    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, [startStreaming]);

  return { streamedContent, isStreaming };
}
