export const ErrorView = ({ text }) => {
  return (
    <div className="py-1 px-2 flex items-center justify-center gap-x-2">
      <i className="fas fa-exclamation-triangle text-red-700"></i>
      <h1 className="text-red">{text}</h1>
    </div>
  );
};
