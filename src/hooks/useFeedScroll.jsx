import { useEffect, useRef } from "react";
import { createRef, useCallback, useState } from "react";

export const useFeedScroll = (dependancies = [], cushion = 100) => {
  const [isFollowing, setFollowing] = useState(true);

  const container = useRef();

  useEffect(() => {
    if (isFollowing) scrollToBottom();
  }, dependancies);

  const handleScroll = useCallback((e) => {
    const containerHeight = e.target.scrollHeight;
    const currentScroll = e.target.scrollTop + e.target.offsetHeight;
    const distanceToBottom = containerHeight - currentScroll;
    if (distanceToBottom > cushion) {
      setFollowing(false);
    } else {
      setFollowing(true);
    }
  }, []);

  const containerRef = useCallback((node) => {
    if (!node) console.log("no node no more");
    else {
      node.onscroll = handleScroll;
      container.current = node;
      //   scrollToBottom();
    }
    return node;
  }, []);

  function scrollToBottom() {
    container.current?.scrollTo({ behavior: "smooth", top: container.current.scrollHeight });
  }

  return containerRef;
};
