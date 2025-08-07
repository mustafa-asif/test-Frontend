import { cl } from "../../utils/misc";

export const StatBox = ({ title, value, unit = "", icon, iconColor = "bg-green-500", className = "", ...props }) => {
  return (
    <div
      className={cl(
        "relative flex flex-col min-w-0 break-words bg-white rounded-xl hover:shadow-2xl transition duration-300 no-break",
        className
      )}
      style={{
        boxShadow: "0px 0px 30px rgba(16, 185, 129, 0.1), inset 0 -10px 15px 0 rgba(16, 185, 129, 0.2)",
      }}
      {...props}
    >
      <div className="flex-auto p-4">
        <div className="flex flex-wrap">
          <div className="relative w-full max-w-full grow flex-1">
            <h5 className="text-gray-400 uppercase font-bold text-xl">{title}</h5>
            <span className="font-semibold text-4xl text-gray-700 leading-none">{value}</span>
            <span className="font-semibold text-sm ml-1 text-gray-500">{unit}</span>
          </div>
          <div className="relative w-auto flex-initial">
            <div
              className={`text-white p-3 text-center inline-flex items-center justify-center w-16 h-16 rounded-full text-2xl ${iconColor} `}
            >
              <i className={`fas fa-${icon}`}></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
