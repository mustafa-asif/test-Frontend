import { useEffect, useRef, useState } from "react";

export const Copyable = ({ text, children, copyText, className = "", ...rest }) => {
  const [copied, setCopied] = useState(false);
  let timeoutRef = useRef(null).current;

  function copyFn() {
    if (copied) return;
    navigator.clipboard.writeText(copyText || text);
    setCopied(true);
    timeoutRef = setTimeout(() => setCopied(false), 750);
  }

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef);
    };
  }, []);
  return (
    <div className={"relative cursor-pointer " + className} onClick={copyFn}>
      <span {...rest}>{children || text}</span>
      {copied && <span className="text-gray-700 animate-ping absolute left-1/2">Copied!</span>}
    </div>
  );
};
