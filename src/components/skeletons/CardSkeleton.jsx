export const CardSkeleton = ({ partsCount, type }) => {
  return (
    <>
      <div
        className="grid grid-cols-4 gap-2 p-4 bg-white transition duration-300 rounded-lg z-10"
        style={{
          boxShadow: "0px 1px 5px rgba(0, 0, 0, .2), inset 0 -1px 10px 0 rgba(0, 0, 0, 0.1",
        }}>
        <div className="flex items-center col-span-2 -mt-1">
          <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        <div className="flex items-center col-span-2 justify-end -mt-1">
          <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse"></div>
        </div>

        {[...Array(partsCount)].map((e, i) => (
          <div className="h-10 col-span-2 bg-gray-200 rounded-full animate-pulse" key={i}></div>
        ))}

        {type === 1 && (
          <>
            <div className="h-10 col-span-4 bg-gray-200 rounded-full animate-pulse"></div>
          </>
        )}

        {type === 2 && (
          <>
            <div className="h-10 col-span-1 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-10 col-span-1 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-10 col-span-1 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-10 col-span-1 bg-gray-200 rounded-full animate-pulse"></div>
          </>
        )}

        {type === 3 && (
          <>
            <div className="h-10 col-span-4 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-10 col-span-2 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-10 col-span-2 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-10 col-span-4 bg-gray-200 rounded-full animate-pulse"></div>
          </>
        )}
      </div>
    </>
  );
};
