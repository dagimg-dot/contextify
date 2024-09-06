import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Check } from "lucide-react";
import { ThemeToggle } from "@/components/custom/ThemeToggle";
import { db, type Prompt } from "@/services/db";
import { useLiveQuery } from "dexie-react-hooks";
import { toast } from "sonner";
import useGlobalStore from "@/store";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const navigate = useNavigate();
  const { currentPrompt, updateCurrentPrompt } = useGlobalStore();

  const prompts = useLiveQuery(() => db.prompts.toArray());

  const savePrompt = async () => {
    if (customPrompt.trim()) {
      try {
        const newPrompt = {
          content: customPrompt.trim(),
          name: `Custom Prompt ${new Date().toLocaleString()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          isDefault: false,
        };

        const newPromptId = await db.prompts.add(newPrompt);

        if (newPromptId) {
          updateCurrentPrompt(newPrompt);
          setCustomPrompt("");
        }
      } catch (error) {
        if ((error as Error).message.includes("uniqueness")) {
          toast.error("Prompt already exists");
        }
      }
    }
  };

  const selectPrompt = async (prompt: Prompt) => {
    updateCurrentPrompt(prompt);
  };

  const deletePrompt = async (id: number) => {
    try {
      await db.prompts.delete(id);
    } catch (error) {
      console.error("Failed to delete prompt:", error);
      toast.error("Failed to delete prompt");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ChevronLeft className="w-5 h-5" />
          <span className="sr-only">Back to main</span>
        </Button>
        <h1 className="text-xl font-bold">Settings</h1>
        <ThemeToggle />
      </header>
      <main className="flex-1 overflow-hidden p-4">
        <Tabs defaultValue="api" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="api">API Key</TabsTrigger>
            <TabsTrigger value="prompts">Prompts</TabsTrigger>
          </TabsList>
          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>Gemini API Key</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 text-center">
                <Input
                  type="password"
                  placeholder="Enter your API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <Button
                  className="w-full"
                  onClick={() => alert("API key saved!")}
                >
                  Save API Key
                </Button>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  className="text-sm text-blue-600"
                >
                  Don't have an API key? Get one here!
                </a>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="prompts">
            <Card>
              <CardHeader>
                <CardTitle>Custom Prompts</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter your custom prompt..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={4}
                />
                <Button
                  className="mt-4 w-full"
                  onClick={savePrompt}
                  disabled={customPrompt.trim() === ""}
                >
                  Save Prompt
                </Button>
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Saved Prompts:</h3>
                  <ScrollArea className="h-[200px]">
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
                          prompt.id === currentPrompt?.id
                            ? "border-primary"
                            : ""
                        }`}
                      >
                        <CardContent className="p-2">
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
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
