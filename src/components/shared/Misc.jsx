export const Stepper = ({ current, max }) => {
  return (
    <div className="flex gap-x-1 w-max mx-auto">
      {[...Array(max)].map((_, i) => (
        <span
          key={i}
          className={`w-3 h-3 rounded-full ${i + 1 === current ? "bg-primary shadow-md" : "bg-gray-100"}`}
        ></span>
      ))}
    </div>
  );
};
