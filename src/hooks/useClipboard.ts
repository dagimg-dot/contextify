import { useState } from "react";
import { toast } from "sonner";

const useClipboard = () => {
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboardMain = (text: string) => {
    return navigator.clipboard.writeText(text).then(
      () => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        toast.success("Copied to clipboard!");
      },
      (err) => {
        toast.error("Failed to copy: " + err.message);
      }
    );
  };

  const copyToClipboardFallback = (text: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (successful) {
        setCopySuccess(true);
        toast.success("Copied to clipboard!");
      } else {
        throw new Error("Failed to copy to clipboard");
      }
    } catch (error) {
      setCopySuccess(false);
      toast.error("Failed to copy to clipboard. Please try again.");
    } finally {
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      copyToClipboardMain(text).catch(() => copyToClipboardFallback(text));
    } else {
      copyToClipboardFallback(text);
    }
  };

  return { copyToClipboard, copySuccess };
};

export default useClipboard;
