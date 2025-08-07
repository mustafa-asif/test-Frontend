import { withCatch } from "../../components/shared/SafePage";
import { StatsDashboard } from "../../components/shared/StatsDashboard";
import { currencyFormatter, fmtDate, getStatKeyColor } from "../../utils/misc";

const followupSchema = [
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
      title: "completion_rate",
      unit: "%",
      icon: "percent",
      iconColor: "bg-gray-500",
      valuePaths: ["count", "completion_rate_orders"],
    },
    valueFormatter: (val = 0) => (val > 0 ? (val * 100).toFixed(2) : val * 100),
  },
  {
    type: "statbox",
    props: {
      title: "fulfilled",
      unit: "pickups",
      icon: "truck",
      iconColor: "bg-green-500",
      valuePaths: ["count", "fulfilled_pickups"],
    },
    valueFormatter: currencyFormatter,
  },
  {
    type: "linechart",
    props: {
      title: "orders_trend",
      valuePaths: ["previous_counts"],
    },
    getLabels: (val) =>
      val.map((data) => fmtDate(data.start_date) + " - " + fmtDate(data.end_date)),
    getDatasets: (previous_counts) => {
      return [
        {
          label: "completion_rate",
          backgroundColor: "#65a30d",
          borderColor: "#65a30d",
          data: previous_counts.map((count) => count.completion_rate_orders * 100),
          fill: false,
        },
      ];
    },
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
    antiFilters: ["client_id"],
  },
];

function Dashboard2(props) {
  return (
    //
    <StatsDashboard
      schema={followupSchema}
      initialFilters={{
        from_date: null,
        to_date: null,
        client_id: null,
        warehouse_id: null,
        deliverer_id: null,
      }}
    />
    //
  );
}

export default withCatch(Dashboard2);
