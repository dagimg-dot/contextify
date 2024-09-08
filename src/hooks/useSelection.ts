import { useState, useEffect, useCallback } from "react";

const useTextSelection = () => {
  const [selectedText, setSelectedText] = useState("");

  const handleSelection = useCallback(() => {
    setTimeout(() => {
      const selection = window.getSelection();
      const selected = selection?.toString() || "";
      setSelectedText(selected);
    }, 0);
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelection);
    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("touchend", handleSelection);
    document.addEventListener("keyup", handleSelection);

    return () => {
      document.removeEventListener("selectionchange", handleSelection);
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("touchend", handleSelection);
      document.removeEventListener("keyup", handleSelection);
    };
  }, [handleSelection]);

  return selectedText;
};

export default useTextSelection;
