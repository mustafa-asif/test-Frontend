import { createContext, createRef, useContext, useEffect, useState } from "react";

export const ScrollContext = createContext({ listenScrollEnd: (func) => { } });

export const ScrollContainer = ({ children, cushion = 0, ...props }) => {
  const [onScrollEnd, setScrollEnd] = useState();
  const container = createRef();

  useEffect(() => {
    container.current.onscroll = function () {
      if (onScrollEnd) {
        if (!container.current) return;
        const endOfPage = container.current.scrollHeight;
        const pageHeight = container.current.offsetHeight;
        const scrollPosition = container.current.scrollTop;

        const endTriggerPosition = endOfPage - pageHeight - cushion;

        if (endTriggerPosition === scrollPosition) {
          console.log("scroll reached end");
          onScrollEnd();
        }
      }
    };
  }, [onScrollEnd]);

  function listenScrollEnd(func) {
    setScrollEnd(() => func);
  }

  return (
    <ScrollContext.Provider value={{ listenScrollEnd }}>
      <div {...props} ref={container}>
        {children}
      </div>
    </ScrollContext.Provider>
    //
  );
};

export const useScrollHandler = (callback) => {
  const { listenScrollEnd } = useContext(ScrollContext);

  useEffect(() => {
    listenScrollEnd(callback);
    return () => listenScrollEnd(null);
  }, [callback]);
};
