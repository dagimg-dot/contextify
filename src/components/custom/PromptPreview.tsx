import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect } from "react";

interface PromptPreviewProps {
  children: React.ReactNode;
  finalPrompt: string;
  isPreviewing: boolean;
  setIsPreviewing: (isPreviewing: boolean) => void;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  selectedText: string;
  clearInput: () => void;
}

const PromptPreview = ({
  children,
  finalPrompt,
  isPreviewing,
  selectedText,
  setIsPreviewing,
  textAreaRef,
}: PromptPreviewProps) => {
  useEffect(() => {
    let popOverEl: HTMLDivElement;
    const textAreaEl = textAreaRef.current;

    const handlePreview = (event: MouseEvent) => {
      popOverEl = document.querySelector(
        "[data-radix-popper-content-wrapper]"
      )!;

      if (isPreviewing && !popOverEl?.contains(event.target as Node)) {
        setIsPreviewing(false);
      }

      if (textAreaEl?.contains(event.target as Node)) {
        setIsPreviewing(true);

        // Use a slight delay to allow the popover to open before focusing the textarea
        setTimeout(() => {
          textAreaEl.focus();
        }, 100);
      }
    };

    document.addEventListener("click", handlePreview);

    return () => {
      document.removeEventListener("click", handlePreview);
    };
  }, [setIsPreviewing, textAreaRef, isPreviewing]);

  return (
    <Popover open={isPreviewing}>
      <PopoverTrigger asChild>
        <div className="w-full">{children}</div>
      </PopoverTrigger>
      <PopoverContent className="w-80 mb-4 pop" side="top">
        <div className="space-y-2">
          <h4 className="font-medium leading-none">Preview</h4>
          <p className="text-sm text-muted-foreground">
            Selected Word: {selectedText}
          </p>
          <p className="text-sm text-muted-foreground">
            Here's how your input will be transformed into a prompt:
          </p>
          <div className="border p-2 rounded-md">
            <p className="text-sm">
              {finalPrompt == "" ? "Write something..." : finalPrompt}
            </p>
          </div>
          {/* <div className="flex justify-between">
            <Button
              size="sm"
              disabled={selectedText === ""}
              onClick={chooseWord}
            >
              Choose Word
            </Button>
            <Button variant="destructive" size="sm" onClick={clearInput}>
              Clear
            </Button>
          </div> */}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PromptPreview;
