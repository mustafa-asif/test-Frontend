import { useStoreState } from "easy-peasy";
import { useEffect, useRef } from "react";

const useNextEffects = (func, model, deps) => {
  const inited = useStoreState((state) => state[model]?.inited);
  const skippedRef = useRef(false);

  useEffect(() => {
    // console.log(`inited: ${inited}; skipped: ${skippedRef.current}`);
    if (inited && skippedRef.current) func();
    else if (inited) skippedRef.current = true;
    if (!skippedRef.current) skippedRef.current = true;
  }, deps);
};

export default useNextEffects;
