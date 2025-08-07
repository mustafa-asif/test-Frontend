import { useState } from "react";

export const ScoreComponent = ({ value, onChange }) => {
  const [score, setScore] = useState(value);

  function toggleScore(num) {
    setScore(num);
    onChange(num);
  }

  function getBtnColor(isSelected, color) {
    if (isSelected) {
      return `bg-${color}-500 text-white`;
    }
    return `hover:bg-${color}-600 text-${color}-500 hover:text-white`;
  }

  return (
    <div className="flex">
      <div
        className={`rounded-full ${getBtnColor(
          score > 0,
          "green"
        )} h-10 flex grow items-center justify-center shadow-sm hover:shadow-md transition duration-300 cursor-pointer mr-1`}
        onClick={() => toggleScore(1)}
      >
        <i className="fas fa-thumbs-up"></i>
      </div>
      <div
        className={`rounded-full ${getBtnColor(
          score < 0,
          "red"
        )} h-10 flex grow items-center justify-center shadow-sm hover:shadow-md transition duration-300 cursor-pointer`}
        onClick={() => toggleScore(-1)}
      >
        <i className="fas fa-thumbs-down"></i>
      </div>
    </div>
  );
};
