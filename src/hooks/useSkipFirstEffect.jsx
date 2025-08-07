import { useEffect } from "react";
import { useRef } from "react";

export const useSkipFirstEffect = (func, deps) => {
  const firstRan = useRef(false);
  return useEffect(() => {
    if (firstRan.current) func();
    else firstRan.current = true;
  }, deps);
};
