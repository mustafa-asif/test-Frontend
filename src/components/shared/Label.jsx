export const Label = ({ className = "mb-2", children, text = "", ...props }) => (
  <label className={`block text-md font-medium text-gray-700 font-sans ${className}`} {...props}>
    {children ? children : text}
  </label>
);
