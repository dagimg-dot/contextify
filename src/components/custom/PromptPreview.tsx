import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "@/services/db";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect } from "react";
import { toast } from "sonner";

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
  const prompts = useLiveQuery(() => db.prompts.toArray());
  const choosenPrompt = useLiveQuery(() =>
    db.prompts.where("isCurrent").equals(1).first()
  );

  useEffect(() => {
    let popOverEl: HTMLDivElement;
    const textAreaEl = textAreaRef.current;

    const handlePreview = (event: MouseEvent) => {
      popOverEl = document.querySelector(
        "[data-radix-popper-content-wrapper]"
      )!;

      if (!isPreviewing && textAreaEl?.value !== "") {
        setIsPreviewing(true);
      }

      if (isPreviewing && !popOverEl?.contains(event.target as Node)) {
        const selectListEl = document.querySelector(
          '[data-radix-popper-content-wrapper][dir="ltr"]'
        );
        if (!selectListEl) {
          setIsPreviewing(false);
        }
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

  const selectPrompt = async (value: string) => {
    try {
      await db.prompts.where("isCurrent").equals(1).modify({ isCurrent: 0 });
      await db.prompts.where("name").equals(value).modify({ isCurrent: 1 });
    } catch (error) {
      toast.error("Failed to change prompt");
    }
  };

  return (
    <Popover open={isPreviewing}>
      <PopoverTrigger asChild>
        <div className="w-full">{children}</div>
      </PopoverTrigger>
      <PopoverContent className="w-80 mb-4 pop" side="top">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="font-medium leading-none">Preview</h4>
            <Select
              defaultValue={choosenPrompt?.name}
              onValueChange={(value) => selectPrompt(value)}
            >
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Prompts" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Prompts</SelectLabel>
                  {prompts?.map((prompt) => (
                    <SelectItem key={prompt.id} value={prompt.name}>
                      {prompt.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground">
            Selected Word: {selectedText}
          </p>
          <p className="text-sm text-muted-foreground">
            Here's how your input will be transformed into a prompt:
          </p>
          <div className="border p-2 rounded-md">
            <p className="text-sm">
              {finalPrompt == "" ? (
                <span className="dot-animation"></span>
              ) : (
                finalPrompt
              )}
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
