import { withCatch } from "../../components/shared/SafePage";
import { StatsDashboard } from "../../components/shared/StatsDashboard";
import { currencyFormatter, getStatKeyColor } from "../../utils/misc";

const warehouseSchema = [
  {
    type: "statbox",
    props: {
      title: "delivered",
      unit: "orders",
      icon: "check-double",
      iconColor: "bg-green-500",
      valuePaths: ["count", "fulfilled_orders"],
    },
    valueFormatter: currencyFormatter,
  },
  {
    type: "statbox",
    props: {
      title: "pending",
      unit: "orders",
      icon: "motorcycle",
      iconColor: "bg-yellow-500",
      valuePaths: ["count", "active_orders"],
    },
    valueFormatter: currencyFormatter,
  },
  {
    type: "statbox",
    props: {
      title: "completion_rate",
      unit: "%",
      icon: "percent",
      iconColor: "bg-gray-500",
      valuePaths: ["count", "completion_rate_orders"],
    },
    valueFormatter: (val = 0) => (val > 0 ? (val * 100).toFixed(2) : val * 100),
  },
  {
    type: "piechart",
    getLabels: (count) =>
      Object.keys(count).filter(
        (key) => !["completion_rate_orders", "active_orders"].includes(key)
      ),
    getDatasets: (count) => [
      {
        data: Object.keys(count)
          .filter((key) => !["completion_rate_orders", "active_orders"].includes(key))
          .map((key) => count[key]),
        backgroundColor: Object.keys(count)
          .filter((key) => !["completion_rate_orders", "active_orders"].includes(key))
          .map((key) => getStatKeyColor(key)),
      },
    ],
    props: {
      title: "orders_distribution",
      valuePaths: ["count"],
    },
  },
  {
    type: "statbox",
    props: {
      title: "earning",
      unit: "dh",
      icon: "money-bill",
      iconColor: "bg-gray-700",
      valuePaths: ["capital", "net"],
    },
    valueFormatter: currencyFormatter,
  },
  {
    type: "barchart",
    props: { title: "time_distribution", valuePaths: ["time"] },
    getLabels: (time) => Object.keys(time),
    getDatasets: (time) => [
      {
        label: "avg time spent (hours)",
        data: Object.values(time).map((time) => time / 1000 / 60 / 60),
        backgroundColor: Object.keys(time).map((_) => "#3b82f6"),
        barThickness: 15,
        fill: false,
      },
    ],
  },
  {
    type: "barchart",
    props: { title: "deliverer_completion", valuePaths: ["deliverer_counts"] },
    getLabels: (deliverer_counts) => deliverer_counts.map((val) => val.deliverer.name),
    getDatasets: (deliverer_counts) => [
      {
        label: "deliverer completion rate",
        data: deliverer_counts.map((val) => val.completion_rate_orders),
        backgroundColor: Object.keys(deliverer_counts).map((_) => "#3b82f6"),
        barThickness: 15,
        fill: false,
      },
    ],
  },
];

function Dashboard(props) {
  return (
    //
    <StatsDashboard schema={warehouseSchema} initialFilters={{ from_date: null, to_date: null }} />
    //
  );
}

export default withCatch(Dashboard);
