import { useState, useRef, useEffect } from "react";
import { useSkipFirstEffect } from "./useSkipFirstEffect";

// use >1000ms?
export const useTypeCallback = (onAccept, onType = undefined, delay = 650, initialValue = "") => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [isTyping, setTyping] = useState(false);

  useSkipFirstEffect(() => {
    onAccept(inputValue);
  }, [isTyping]);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const timeoutRef = useRef();

  function handleValueChange(val) {
    setInputValue(val);
    setTyping(true);
    clearTimeout(timeoutRef.current);
    onType?.(val);
    // @ts-ignore
    timeoutRef.current = setTimeout(() => {
      setTyping(false);
    }, delay);
  }

  return { value: inputValue, onValueChange: handleValueChange, setInputValue };
};
