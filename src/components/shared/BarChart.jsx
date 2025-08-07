import Chart from "chart.js";
import { createRef, useEffect } from "react";
import { cl } from "../../utils/misc";

export const BarChart = ({ title, datasets, labels, className = "", options = {}, horizontal = false }) => {
  const elRef = createRef();

  useEffect(() => {
    var ctx = elRef.current?.getContext("2d");
    // @ts-ignore
    new Chart(ctx, getConfig(horizontal ? "horizontalBar" : "bar", datasets, labels, options));
  }, []);

  return (
    <div
      className={cl("relative flex flex-col min-w-0 shadow-lg rounded-xl bg-white no-break", className)}
      style={{
        boxShadow: "0px 0px 30px rgba(16, 185, 129, 0.1), inset 0 -10px 15px 0 rgba(16, 185, 129, 0.2)",
      }}
    >
      <div className="rounded-t px-4 py-3 bg-transparent">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full max-w-full grow flex-1">
            <h2 className="text-gray-400 uppercase font-bold text-xl">{title}</h2>
          </div>
        </div>
      </div>
      <div className="p-4 flex-auto">
        <div className="relative h-350-px">
          <canvas ref={elRef}></canvas>
        </div>
      </div>
    </div>
  );
};

function getConfig(type, datasets, labels, options = {}) {
  return {
    type,
    data: {
      labels,
      datasets,
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      legend: {
        labels: {
          fontColor: "rgba(0,0,0,.4)",
        },
        align: "end",
        position: "bottom",
      },
      ...options,
    },
  };
}
