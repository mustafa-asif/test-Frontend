import { useCallback, useEffect, useRef, useState } from "react";

export const Dots = ({ isAnimating, speed = 500, ...props }) => {
  const [dots, setDots] = useState("");
  let timeout = useRef().current;

  const changeDots = useCallback(() => {
    if (dots === "") setDots(".");
    if (dots === ".") setDots("..");
    if (dots === "..") setDots("...");
    if (dots === "...") setDots("");
  }, [dots]);

  function stopAnim() {
    setDots("");
    clearTimeout(timeout);
  }

  useEffect(() => {
    if (!isAnimating) stopAnim();
    return () => stopAnim();
  }, [isAnimating]);

  useEffect(() => {
    if (isAnimating) {
      timeout = setTimeout(changeDots, speed);
    }
  }, [dots, isAnimating]);
  return (
    <span className="relative" {...props}>
      <span className="opacity-0">...</span>
      <span className="left-0 absolute">{dots}</span>
    </span>
  );
};
