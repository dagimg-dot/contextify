import { useState, useRef, useEffect } from "react";

const useHover = <T extends HTMLElement>(): [React.RefObject<T>, boolean] => {
  const [isHovered, setIsHovered] = useState(false);
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const node = elementRef.current;

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    if (node) {
      node.addEventListener("mouseenter", handleMouseEnter);
      node.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (node) {
        node.removeEventListener("mouseenter", handleMouseEnter);
        node.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return [elementRef, isHovered];
};

export default useHover;

