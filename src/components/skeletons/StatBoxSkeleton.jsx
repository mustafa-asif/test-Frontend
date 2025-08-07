import { cl } from "../../utils/misc";

export const StatBoxSkeleton = ({ className = "", ...props }) => {
  return (
    <div
      className={cl(
        "relative flex flex-col min-w-0 break-words bg-white rounded-md shadow-lg hover:shadow-2xl transition duration-300",
        className
      )}
      {...props}
    >
      <div className="flex-auto p-4">
        <div className="flex flex-wrap">
          <div className="relative w-full max-w-full grow flex-1">
            <div className="h-6 mb-2 w-40 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-6 mb-2 w-16 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
          <div className="relative w-auto flex-initial">
            <div className="text-white p-3 text-center inline-flex items-center justify-center w-16 h-16 shadow-lg rounded-full text-2xl bg-gray-200 animate-pulse">
              <i className="fas fa-clock"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
