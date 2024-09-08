import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft } from "lucide-react";
import { ThemeToggle } from "@/components/custom/ThemeToggle";
import Prompts from "@/components/custom/Prompts";
import GeneralSettings from "@/components/custom/GeneralSettings";

export default function SettingsPage() {
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
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="prompts">Prompts</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <GeneralSettings />
          </TabsContent>
          <TabsContent value="prompts">
            <Prompts />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
