import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft } from "lucide-react";
import { ThemeToggle } from "@/components/custom/ThemeToggle";
import Prompts from "@/components/custom/Prompts";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const navigate = useNavigate();

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
            <Prompts />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
