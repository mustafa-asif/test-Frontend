import { useEffect } from "react";
import Chart from "chart.js";
import { useTranslation } from "../../i18n/provider";
import { useStoreState } from "easy-peasy";
import { createRef } from "react";

export const OrdersReportCard = () => {
  const tl = useTranslation();
  const { loading, error, stats } = useStoreState(state => state.dashboard);
  const elRef = createRef();

  useEffect(() => {
    if (stats?.orders_report) {
      var ctx = elRef.current?.getContext("2d");
      // @ts-ignore
      new Chart(ctx, getConfig(stats.orders_report));
    }
  }, [stats?.orders_report]);

  if (loading || !stats.orders_report) {
    return (
      <div>
        <h1>...</h1>
      </div>
    );
  }

  return (
    <div
      className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-xl bg-gray-700"
      style={{
        boxShadow: "0px 0px 30px rgba(16, 185, 129, 0.1), inset 0 -10px 15px 0 rgba(16, 185, 129, 0.2)",
      }}
    >
      <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full max-w-full grow flex-1">
            <h2 className="text-white text-xl font-semibold">{tl("orders_report")}</h2>
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

function getConfig(orders_report) {
  return {
    type: "line",
    data: {
      labels: orders_report.map(report => report.month),
      datasets: [
        {
          label: "Livré",
          backgroundColor: "#10B981",
          borderColor: "#10B981",
          data: orders_report.map(report => report.fulfilled),
          fill: false,
        },
        {
          label: "recu par livreur",
          backgroundColor: "#FBBF24",
          borderColor: "#FBBF24",
          data: orders_report.map(report => report.requested),
          fill: false,
        },
        {
          label: "Annulé",
          backgroundColor: "#EF4444",
          borderColor: "#EF4444",
          data: orders_report.map(report => report.cancelled),
          fill: false,
        },
        {
          label: "Refusé",
          backgroundColor: "#FCA5A5",
          borderColor: "#FCA5A5",
          data: orders_report.map(report => report.refused),
          fill: false,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      title: {
        display: false,
        text: "Orders report",
        fontColor: "white",
      },
      legend: {
        labels: {
          fontColor: "white",
        },
        align: "end",
        position: "bottom",
      },
      tooltips: {
        mode: "index",
        intersect: false,
      },
      hover: {
        mode: "nearest",
        intersect: true,
      },
      scales: {
        xAxes: [
          {
            ticks: {
              fontColor: "rgba(255,255,255,.7)",
            },
            display: true,
            scaleLabel: {
              display: false,
              labelString: "Month",
              fontColor: "white",
            },
            gridLines: {
              display: false,
              borderDash: [2],
              borderDashOffset: [2],
              color: "rgba(33, 37, 41, 0.3)",
              zeroLineColor: "rgba(0, 0, 0, 0)",
              zeroLineBorderDash: [2],
              zeroLineBorderDashOffset: [2],
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              fontColor: "rgba(255,255,255,.7)",
              precision: 0,
              beginAtZero: true,
            },
            display: true,
            scaleLabel: {
              display: false,
              labelString: "Value",
              fontColor: "white",
            },
            gridLines: {
              borderDash: [3],
              borderDashOffset: [3],
              drawBorder: false,
              color: "rgba(255, 255, 255, 0.15)",
              zeroLineColor: "rgba(33, 37, 41, 0)",
              zeroLineBorderDash: [2],
              zeroLineBorderDashOffset: [2],
            },
          },
        ],
      },
    },
  };
}
