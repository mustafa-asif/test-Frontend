import { useEffect } from "react";
import Chart from "chart.js";
import { useTranslation } from "../../i18n/provider";
import { useStoreState } from "easy-peasy";
import { createRef } from "react";

export const FinancialReportCard = () => {
  const tl = useTranslation();
  const { loading, error, stats } = useStoreState(state => state.dashboard);
  const elRef = createRef();

  useEffect(() => {
    if (stats?.financial_report) {
      var ctx = elRef.current?.getContext("2d");
      // @ts-ignore
      new Chart(ctx, getConfig(stats.financial_report));
    }
  }, [stats?.financial_report]);

  if (loading || !stats.financial_report) {
    return (
      <div>
        <h1>...</h1>
      </div>
    );
  }

  return (
    <div
      className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-xl"
      style={{
        boxShadow: "0px 0px 30px rgba(16, 185, 129, 0.1), inset 0 -10px 15px 0 rgba(16, 185, 129, 0.2)",
      }}
    >
      <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full max-w-full grow flex-1">
            <h2 className="text-gray-700 text-xl font-semibold">{tl("financial_report")}</h2>
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

function getConfig(financial_report) {
  return {
    type: "bar",
    data: {
      labels: financial_report.map(report => report.month),
      datasets: [
        {
          label: "Revenu total",
          backgroundColor: "#10B981",
          borderColor: "#10B981",
          data: financial_report.map(report => report.total_earnings),
          fill: false,
          barThickness: 8,
        },
        {
          label: "Frais de livraison",
          backgroundColor: "#64748B",
          borderColor: "#64748B",
          data: financial_report.map(report => -report.total_costs),
          fill: false,
          barThickness: 8,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      title: {
        display: false,
        text: "Financial report",
      },
      tooltips: {
        mode: "index",
        intersect: false,
      },
      hover: {
        mode: "nearest",
        intersect: true,
      },
      legend: {
        labels: {
          fontColor: "rgba(0,0,0,.4)",
        },
        align: "end",
        position: "bottom",
      },
      scales: {
        xAxes: [
          {
            display: false,
            scaleLabel: {
              display: true,
              labelString: "Month",
            },
            gridLines: {
              borderDash: [2],
              borderDashOffset: [2],
              color: "rgba(33, 37, 41, 0.3)",
              zeroLineColor: "rgba(33, 37, 41, 0.3)",
              zeroLineBorderDash: [2],
              zeroLineBorderDashOffset: [2],
            },
          },
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: false,
              labelString: "Value",
            },
            gridLines: {
              borderDash: [2],
              drawBorder: false,
              borderDashOffset: [2],
              color: "rgba(33, 37, 41, 0.2)",
              zeroLineColor: "rgba(33, 37, 41, 0.15)",
              zeroLineBorderDash: [2],
              zeroLineBorderDashOffset: [2],
            },
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  };
}
