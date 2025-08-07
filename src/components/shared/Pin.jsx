import { useState } from "react";

export const Pin = ({ value, onChange }) => {
  const [pinned, setPinned] = useState(value);

  function togglePinned() {
    setPinned(!pinned);
    onChange(!pinned);
  }

  return (
    <i
      className={`fas fa-thumbtack ml-3 -mt-1 text-lg cursor-pointer ${pinned ? "text-red-300" : "text-gray-500 hover:text-gray-700"
        }`}
      onClick={togglePinned}></i>
  );
};
