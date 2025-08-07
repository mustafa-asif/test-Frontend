import { withCatch } from "../../components/shared/SafePage";
import { StatsDashboard } from "../../components/shared/StatsDashboard";
import { currencyFormatter, fmtDate, getStatKeyColor } from "../../utils/misc";

const commercialSchema = [
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
  // {
  //   type: "linechart",
  //   props: {
  //     title: "orders_trend",
  //     valuePaths: ["previous_counts"],
  //   },
  //   getLabels: (val) => val.map((data) => dateToMonth(data.end_date)),
  //   getDatasets: (previous_counts) => [
  //     {
  //       label: "fulfilled",
  //       backgroundColor: "#65a30d",
  //       borderColor: "#65a30d",
  //       data: previous_counts.map((count) => count.fulfilled_orders),
  //       fill: false,
  //     },
  //     {
  //       label: "active",
  //       backgroundColor: "#86efac",
  //       borderColor: "#86efac",
  //       data: previous_counts.map((count) => count.active_orders),
  //       fill: false,
  //     },
  //     {
  //       label: "cancelled",
  //       backgroundColor: "#ef4444",
  //       borderColor: "#ef4444",
  //       data: previous_counts.map((count) => count.cancelled_orders),
  //       fill: false,
  //     },
  //     {
  //       label: "refused",
  //       backgroundColor: "#fca5a5",
  //       borderColor: "#fca5a5",
  //       data: previous_counts.map((count) => count.refused_orders),
  //       fill: false,
  //     },
  //   ],
  // },
];

function Dashboard2(props) {
  return (
    //
    <StatsDashboard
      schema={commercialSchema}
      initialFilters={{
        from_date: null,
        to_date: null,
        client_id: null,
      }}
    />
    //
  );
}

export default withCatch(Dashboard2);
