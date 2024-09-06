import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UserGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserGuide = ({ open, onOpenChange }: UserGuideProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-[400px] rounded-md">
      <DialogHeader>
        <DialogTitle>Welcome to Contextify!</DialogTitle>
        <DialogDescription>
          Here's a quick guide on how to use the app:
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <p>1. Enter a word and its context in the input field at the bottom.</p>
        <p>2. Click the send button or press Enter to get an explanation.</p>
        <p>
          3. View your search history by clicking the menu icon in the top
          right.
        </p>
        <p>4. Customize your API key and prompts in the settings page.</p>
        <p>
          5. Access this guide anytime by clicking the help icon in the history
          drawer.
        </p>
      </div>
      <Button onClick={() => onOpenChange(false)}>Got it!</Button>
    </DialogContent>
  </Dialog>
);

export default UserGuide;
