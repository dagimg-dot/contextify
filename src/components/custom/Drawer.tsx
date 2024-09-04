import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Menu, HelpCircle, ChevronLeft } from "lucide-react";
import { MessageType } from "@/types/types";

interface DrawerProps {
  messages: MessageType[];
  onShowGuide: () => void;
}

const Drawer = ({ messages, onShowGuide }: DrawerProps) => {
  const [searchHistory, setSearchHistory] = useState("");

  const filteredMessages = useMemo(
    () =>
      messages.filter(
        (m) =>
          m.type === "user" &&
          m.content.toLowerCase().includes(searchHistory.toLowerCase())
      ),
    [messages, searchHistory]
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="w-5 h-5" />
          <span className="sr-only">History</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader className="flex flex-row items-center justify-between mb-4">
          <div className="flex-1 mr-4">
            <Input
              type="text"
              placeholder="Search history..."
              value={searchHistory}
              onChange={(e) => setSearchHistory(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={onShowGuide}>
              <HelpCircle className="w-5 h-5" />
              <span className="sr-only">Help</span>
            </Button>
            <SheetClose asChild>
              <Button variant="ghost" size="icon">
                <ChevronLeft className="w-5 h-5" />
                <span className="sr-only">Close</span>
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {filteredMessages.map((message, index) => (
            <Card key={index} className="mb-2">
              <CardHeader className="py-2">
                <CardTitle className="text-sm">{message.content}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default Drawer;
