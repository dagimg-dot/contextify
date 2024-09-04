import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft } from "lucide-react";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [customPrompt, setCustomPrompt] = useState(
    "Can you explain the meaning of the word '[insert new word]' in this sentence: '[insert sentence]'? Please summarize the explanation in one paragraph."
  );
  const [savedPrompts, setSavedPrompts] = useState([
    "Can you explain the meaning of the word '[insert new word]' in this sentence: '[insert sentence]'? Please summarize the explanation in one paragraph.",
  ]);
  const navigate = useNavigate();

  const savePrompt = () => {
    if (customPrompt && !savedPrompts.includes(customPrompt)) {
      setSavedPrompts((prev) => [...prev, customPrompt]);
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
        <div className="w-5" />
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
              <CardContent>
                <Input
                  type="password"
                  placeholder="Enter your API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <Button
                  className="mt-4 w-full"
                  onClick={() => alert("API key saved!")}
                >
                  Save API Key
                </Button>
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
                <Button className="mt-4 w-full" onClick={savePrompt}>
                  Save Prompt
                </Button>
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Saved Prompts:</h3>
                  <ScrollArea className="h-[200px]">
                    {savedPrompts.map((prompt, index) => (
                      <Card key={index} className="mb-2">
                        <CardContent className="p-2">
                          <p className="text-sm">{prompt}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2"
                            onClick={() => setCustomPrompt(prompt)}
                          >
                            Use
                          </Button>
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
