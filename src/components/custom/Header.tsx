import { Book, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Drawer from "@/components/custom/Drawer";
import { ThemeToggle } from "@/components/custom/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/store";

interface HeaderProps {
  onShowGuide: () => void;
}

const Header = ({ onShowGuide }: HeaderProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-2">
        <Book className="w-6 h-6" />
        <h1 className="text-xl font-bold">Contextify</h1>
      </div>
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/settings")}
        >
          <Settings className="w-5 h-5" />
          <span className="sr-only">Settings</span>
        </Button>
        {isMobile && <Drawer onShowGuide={onShowGuide} />}
      </div>
    </header>
  );
};

export default Header;
