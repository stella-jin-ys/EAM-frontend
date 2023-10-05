import { useCallback, useState } from "react";

export const useCenteredTree = () => {
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const containerRef = useCallback((containerElem) => {
    if (containerElem !== null) {
      const { width, height } = containerElem.getBoundingClientRect();
        setTranslate({ x: width / 80, y: height / 50 });
        console.log(translate);
    }
  }, []);
  return [translate, containerRef];
};
