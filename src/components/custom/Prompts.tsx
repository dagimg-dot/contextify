import { ScrollArea } from "@/components/ui/scroll-area";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { db, type Prompt } from "@/services/db";
import { useLiveQuery } from "dexie-react-hooks";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const Prompts = () => {
  const [customPrompt, setCustomPrompt] = useState("");
  const [promptName, setPromptName] = useState("");
  const prompts = useLiveQuery(() => db.prompts.toArray());
  const currentPrompt = useLiveQuery(() =>
    db.prompts.where("isCurrent").equals(1).first()
  );

  const savePrompt = async () => {
    if (customPrompt.trim()) {
      try {
        await db.transaction("rw", db.prompts, async () => {
          const newPrompt = {
            content: customPrompt.trim(),
            name: promptName.trim(),
            createdAt: new Date(),
            updatedAt: new Date(),
            isDefault: false,
            isCurrent: 0 as const,
          };

          const newPromptId = await db.prompts.add(newPrompt);

          if (newPromptId) {
            selectPrompt(newPrompt);
            setCustomPrompt("");

            toast.success("The prompt has been successfully saved.");
          }
        });
      } catch (error) {
        if ((error as Error).message.includes("uniqueness")) {
          toast.error("Prompt already exists");
        } else {
          toast.error("Failed to save prompt");
        }
      }
    }
  };

  const selectPrompt = async (prompt: Prompt) => {
    try {
      await db.prompts.where("isCurrent").equals(1).modify({ isCurrent: 0 });
      await db.prompts.update(prompt.id!, {
        isCurrent: 1,
      });
    } catch (error) {
      toast.error("Failed to change prompt");
    }
  };

  const deletePrompt = async (id: number) => {
    try {
      await db.prompts.delete(id);

      if (prompts?.length == 2) {
        selectPrompt(prompts[0]);
      }

      toast.success("The prompt has been successfully deleted.");
    } catch (error) {
      toast.error("Failed to delete prompt");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Prompts</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          placeholder="Enter name for your prompt"
          value={promptName}
          onChange={(e) => setPromptName(e.target.value)}
          className="mb-4"
        />
        <Textarea
          placeholder="Enter your custom prompt..."
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          rows={4}
        />
        <Button
          className="mt-4 w-full"
          onClick={savePrompt}
          disabled={customPrompt.trim() === "" || promptName.trim() === ""}
        >
          Save Prompt
        </Button>
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Saved Prompts:</h3>
          <ScrollArea className="h-auto">
            {prompts?.length === 0 && (
              <Card className="mb-2">
                <CardContent className="p-2">
                  <p className="text-sm italic">
                    You haven't saved any prompts yet.
                  </p>
                </CardContent>
              </Card>
            )}
            {prompts?.length !== 0 && (
              <Card className="mb-2">
                <CardContent className="p-2">
                  <p className="text-sm italic">
                    You have {prompts?.length} saved prompts.
                  </p>
                </CardContent>
              </Card>
            )}
            {prompts?.map((prompt) => (
              <Card
                key={prompt.id}
                className={`mb-2 ${
                  prompt.id === currentPrompt?.id ? "border-primary" : ""
                }`}
              >
                <CardContent className="p-2">
                  <p className="text-sm italic font-bold pb-2">{prompt.name}</p>
                  <p className="text-sm">{prompt.content}</p>
                  <div className="flex justify-between items-center mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => selectPrompt(prompt)}
                    >
                      Use
                    </Button>
                    {prompt.id === currentPrompt?.id && (
                      <span className="text-primary">
                        <Check className="w-4 h-4" />
                      </span>
                    )}
                    {!prompt.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deletePrompt(prompt.id!)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default Prompts;
