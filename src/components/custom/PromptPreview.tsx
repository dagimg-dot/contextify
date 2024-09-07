import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";

interface PromptPreviewProps {
  children: React.ReactNode;
  finalPrompt: string;
  isPreviewing: boolean;
}

const PromptPreview = ({
  children,
  finalPrompt,
  isPreviewing,
}: PromptPreviewProps) => {
  return (
    <Popover open={isPreviewing}>
      <PopoverTrigger asChild>
        <div className="w-full">{children}</div>
      </PopoverTrigger>
      <PopoverContent className="w-80 mb-4" side="top">
        <div className="space-y-2">
          <h4 className="font-medium leading-none">Preview</h4>
          <p className="text-sm text-muted-foreground">
            Here's how your input will be transformed into a prompt:
          </p>
          <div className="border p-2 rounded-md">
            <p className="text-sm">
              {finalPrompt == "" ? "Write something..." : finalPrompt}
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PromptPreview;
