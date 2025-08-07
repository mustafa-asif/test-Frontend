import { useStoreActions, useStoreState } from "easy-peasy";
import { useEffect } from "react";

// make the init before the data update

const useFirstVisit = (func, model) => {
  const inited = useStoreState((state) => state[model]?.inited);
  const setInitied = useStoreActions((actions) => actions[model]?.setInited);
  return useEffect(() => {
    if (!inited) {
      setInitied && setInitied();
      func();
    }
  }, []);
};

export default useFirstVisit;
