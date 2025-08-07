export const Switch = ({ value, onValueChange, options, ...props }) => {
  return (
    <div
      style={{ height: 46 }}
      className="rounded-full w-full border border-gray-200 flex overflow-hidden">
      {options.map((option) => {
        const isSelected = option.value === value;
        const extraClasses = isSelected ? "bg-green-300 shadow-md" : "bg-gray-100 text-gray-400";
        return (
          <div
            className={`cursor-pointer transition-colors duration-200 select-none flex flex-1 items-center justify-center ${extraClasses}`}
            onClick={() => onValueChange(option.value)}>
            {option.label}
          </div>
        );
      })}
    </div>
  );
};
