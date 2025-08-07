import React from "react";

const MessageText = ({ text }) => {
  if (!text) return null;

  // Split text into parts (text and URLs)
  const parts = text.split(/(https?:\/\/[^\s]+)/g);

  return (
    <span>
      {parts.map((part, i) => {
        // Check if part is a URL
        if (part.match(/^https?:\/\/[^\s]+$/)) {
          return (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {part}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
};

export default MessageText; 