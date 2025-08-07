// whitelist bg-green-50 text-green-500 border-green-100
export const NumPod = ({ className = "", color = "green", number, children, ...props }) => {
  return (
    <span
      className={`h-6 min-w-6 px-1 rounded-full bg-${color}-50 text-${color}-500 border border-solid border-${color}-100 flex items-center justify-center ${className}`}
      {...props}>
      {children ?? number}
    </span>
  );
};
