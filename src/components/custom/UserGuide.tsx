import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

interface UserGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserGuide = ({ open, onOpenChange }: UserGuideProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-[400px] max-h-[60vh] rounded-md overflow-auto">
      <DialogHeader>
        <DialogTitle>Welcome to Contextify!</DialogTitle>
        <DialogDescription>
          Here's a quick guide on how to use the app:
        </DialogDescription>
      </DialogHeader>
      <ScrollArea>
        <div className="grid gap-4 py-4">
          <p>1. Enter a sentence in the input field at the bottom.</p>
          <p>2. Select the word you want to be explained.</p>
          <p>
            3. Once you are sure of your selection in the pop over window, click
            the send button or press Enter to get an explanation.
          </p>
          <p>
            4. You can also select between the two available prompts (
            <strong>Default</strong> and <strong>Blank</strong>) in the pop over
            window.
          </p>
          <p>
            5. View your search history by clicking the menu icon in the top
            right.
          </p>
          <p>6. Customize your API key and prompts in the settings page.</p>
          <p>
            7. Access this guide anytime by clicking the help icon in the
            history drawer.
          </p>
        </div>
      </ScrollArea>
      <Button onClick={() => onOpenChange(false)}>Got it!</Button>
    </DialogContent>
  </Dialog>
);

export default UserGuide;
