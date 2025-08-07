import { Fragment, useEffect, useState } from "react";
import { xFetch } from "../../utils/constants";

export const Profit = ({ ...props }) => {
  const [isLoading, setLoading] = useState(true);
  const [currentCycle, setCurrentCycle] = useState(null);

  async function getCurrentCycle() {
    const { data, error } = await xFetch(`/cycles`, undefined, undefined, undefined, [
      `status=active`,
      `_limit=1`,
    ]);
    setLoading(false);
    if (error) return console.error(error);
    setCurrentCycle(data[0] || { total: 0, bonus: 0 });
  }

  useEffect(() => {
    getCurrentCycle();
  }, []);

  const cycleTotal = (currentCycle?.total ?? 0) + (currentCycle?.pending ?? 0);

  return (
    <Fragment>
      <div className="relative p-4 bg-white shadow-lg hover:shadow-xl transition duration-300 rounded-full z-10 text-2xl font-bold uppercase flex items-center justify-center h-12">
        <i className="fas fa-wallet pr-2 text-gray-500"></i>
        {isLoading ? (
          <div className="h-6 w-32 bg-gray-200 rounded-full animate-pulse"></div>
        ) : (
          <span className="text-green-500">{cycleTotal > 0 ? cycleTotal.toFixed(2) : "0.0"}</span>
        )}
        <span className="font-semibold text-xs ml-1 mt-1">{"DH"}</span>
      </div>
      {currentCycle?.bonus?.toFixed(2) > 0 && (
        <div className="p-4 bg-yellow-100 shadow-lg hover:shadow-xl transition duration-300 rounded-full z-10 text-2xl font-bold uppercase flex items-center justify-center h-12">
          <i className="fas fa-gift pr-2 text-gray-500"></i>
          {isLoading ? (
            <div className="h-6 w-32 bg-gray-200 rounded-full animate-pulse"></div>
          ) : (
            <span className="text-green-500">{currentCycle?.bonus?.toFixed(2)}</span>
          )}
          <span className="font-semibold text-xs ml-1 mt-1">{"DH"}</span>
        </div>
      )}
    </Fragment>
  );
};
