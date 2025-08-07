export const Badge = ({ text, label = "", color = "gray", size = "text-sm", className = "" }) => {
  return (
    <span
      className={`h-6 min-w-6 w-max px-1 ${size} rounded-full bg-${color}-50 flex items-center justify-center ${className}`}>
      {text}
    </span>
  );
};
