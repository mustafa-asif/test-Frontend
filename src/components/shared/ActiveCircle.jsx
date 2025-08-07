export function ActiveCircle({ active, onActivate, onDeactivate, loading }) {
  const classes = loading
    ? "bg-gray-200 hover:bg-gray-300 animate-pulse"
    : active
    ? "bg-green-500 hover:bg-green-400"
    : "bg-red-100 hover:bg-green-100";

  return (
    <div className="flex gap-x-1 items-center">
      <div
        className={`uppercase font-semibold ${
          loading ? "text-gray-600" : active ? "text-green-500" : "text-red-500"
        }`}></div>
      <div
        onClick={() => {
          if (loading) return;
          if (!active) return onActivate();
          if (active) return onDeactivate();
        }}
        className={`cursor-pointer shadow-sm hover:shadow-md rounded-full transition-all duration-200 ${classes}`}
        style={{ height: 27, width: 27 }}></div>
    </div>
  );
}
