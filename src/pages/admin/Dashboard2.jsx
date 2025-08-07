import { withCatch } from "../../components/shared/SafePage";
import { StatsDashboard } from "../../components/shared/StatsDashboard";
import { currencyFormatter, fmtDate, getStatKeyColor } from "../../utils/misc";

const adminSchema = [
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
      title: "client_invoices_in",
      unit: "dh",
      icon: "money-bill",
      iconColor: "bg-gray-700",
      valuePaths: ["capital", "client_invoices_in"],
    },
    valueFormatter: currencyFormatter,
    antiFilters: ["warehouse_id", "deliverer_id"],
  },
  {
    type: "statbox",
    props: {
      title: "client_invoices_out",
      unit: "dh",
      icon: "money-bill",
      iconColor: "bg-gray-700",
      valuePaths: ["capital", "client_invoices_out"],
    },
    valueFormatter: currencyFormatter,
    antiFilters: ["warehouse_id", "deliverer_id"],
  },
  {
    type: "statbox",
    props: {
      title: "warehouse_invoices_in",
      unit: "dh",
      icon: "money-bill",
      iconColor: "bg-gray-700",
      valuePaths: ["capital", "warehouse_invoices_in"],
    },
    valueFormatter: currencyFormatter,
    antiFilters: ["client_id", "deliverer_id"],
  },
  {
    type: "statbox",
    props: {
      title: "warehouse_invoices_out",
      unit: "dh",
      icon: "money-bill",
      iconColor: "bg-gray-700",
      valuePaths: ["capital", "warehouse_invoices_out"],
    },
    valueFormatter: currencyFormatter,
    antiFilters: ["client_id", "deliverer_id"],
  },
  {
    type: "statbox",
    props: {
      title: "admin_payments_cash_in",
      unit: "dh",
      icon: "money-bill",
      iconColor: "bg-gray-700",
      valuePaths: ["capital", "admin_payments_cash_in"],
    },
    valueFormatter: currencyFormatter,
    antiFilters: ["client_id", "warehouse_id", "deliverer_id"],
  },
  {
    type: "statbox",
    props: {
      title: "admin_payments_cash_out",
      unit: "dh",
      icon: "money-bill",
      iconColor: "bg-gray-700",
      valuePaths: ["capital", "admin_payments_cash_out"],
    },
    valueFormatter: currencyFormatter,

    antiFilters: ["client_id", "warehouse_id", "deliverer_id"],
  },
  {
    type: "statbox",
    props: {
      title: "admin_payments_bank_in",
      unit: "dh",
      icon: "money-bill",
      iconColor: "bg-gray-700",
      valuePaths: ["capital", "admin_payments_bank_in"],
    },
    valueFormatter: currencyFormatter,
    antiFilters: ["client_id", "warehouse_id", "deliverer_id"],
  },
  {
    type: "statbox",
    props: {
      title: "admin_payments_bank_out",
      unit: "dh",
      icon: "money-bill",
      iconColor: "bg-gray-700",
      valuePaths: ["capital", "admin_payments_bank_out"],
    },
    valueFormatter: currencyFormatter,
    antiFilters: ["client_id", "warehouse_id", "deliverer_id"],
  },
  {
    type: "barchart",
    props: { title: "financial_report", valuePaths: ["previous_capitals"] },
    getLabels: (val) =>
      val.map((data) => fmtDate(data.start_date) + " - " + fmtDate(data.end_date)),
    getDatasets: (previous_capital) => [
      {
        label: "net",
        data: previous_capital.map((capital) => capital.net),
        backgroundColor: previous_capital.map((_) => "#ff0000"),
      },
    ],
    antiFilters: ["client_id", "warehouse_id", "deliverer_id"],
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
    antiFilters: ["client_id", "warehouse_id", "deliverer_id"],
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
    type: "linechart",
    props: {
      title: "orders_trend",
      valuePaths: ["previous_counts"],
    },
    getLabels: (val) =>
      val.map((data) => fmtDate(data.start_date) + " - " + fmtDate(data.end_date)),
    getDatasets: (previous_counts) => [
      {
        label: "fulfilled",
        backgroundColor: "#65a30d",
        borderColor: "#65a30d",
        data: previous_counts.map((count) => count.fulfilled_orders),
        fill: false,
      },
      {
        label: "active",
        backgroundColor: "#86efac",
        borderColor: "#86efac",
        data: previous_counts.map((count) => count.active_orders),
        fill: false,
      },
      {
        label: "cancelled",
        backgroundColor: "#ef4444",
        borderColor: "#ef4444",
        data: previous_counts.map((count) => count.cancelled_orders),
        fill: false,
      },
      {
        label: "refused",
        backgroundColor: "#fca5a5",
        borderColor: "#fca5a5",
        data: previous_counts.map((count) => count.refused_orders),
        fill: false,
      },
    ],
  },
  {
    type: "statbox",
    props: {
      title: "orders_in",
      unit: "dh",
      icon: "money-bill",
      iconColor: "bg-gray-700",
      valuePaths: ["capital", "orders_in"],
    },
    valueFormatter: currencyFormatter,
    antiFilters: ["client_id", "warehouse_id", "deliverer_id"],
  },
  {
    type: "statbox",
    props: {
      title: "orders_out",
      unit: "dh",
      icon: "money-bill",
      iconColor: "bg-gray-700",
      valuePaths: ["capital", "orders_out"],
    },
    valueFormatter: currencyFormatter,
    antiFilters: ["client_id", "warehouse_id", "deliverer_id"],
  },

  {
    type: "statbox",
    props: {
      title: "pickups_in",
      unit: "dh",
      icon: "money-bill",
      iconColor: "bg-gray-700",
      valuePaths: ["capital", "pickups_in"],
    },
    valueFormatter: currencyFormatter,
    antiFilters: ["client_id", "warehouse_id", "deliverer_id"],
  },

  {
    type: "statbox",
    props: {
      title: "packaging_in",
      unit: "dh",
      icon: "money-bill",
      iconColor: "bg-gray-700",
      valuePaths: ["capital", "packaging_in"],
    },
    valueFormatter: currencyFormatter,
    antiFilters: ["client_id", "warehouse_id", "deliverer_id"],
  },
  {
    type: "statbox",
    props: {
      title: "referral_out",
      unit: "dh",
      icon: "money-bill",
      iconColor: "bg-gray-700",
      valuePaths: ["capital", "referral_out"],
    },
    valueFormatter: currencyFormatter,
    antiFilters: ["warehouse_id", "deliverer_id"],
  },
  {
    type: "statbox",
    props: {
      title: "refused_in",
      unit: "dh",
      icon: "money-bill",
      iconColor: "bg-gray-700",
      valuePaths: ["capital", "refused_in"],
    },
    valueFormatter: currencyFormatter,
    antiFilters: ["client_id", "warehouse_id", "deliverer_id"],
  },
  {
    type: "statbox",
    props: {
      title: "transfers_in",
      unit: "dh",
      icon: "money-bill",
      iconColor: "bg-gray-700",
      valuePaths: ["capital", "transfers_in"],
    },
    valueFormatter: currencyFormatter,
    antiFilters: ["client_id", "warehouse_id", "deliverer_id"],
  },
  {
    type: "statbox",
    props: {
      title: "warehousing_in",
      unit: "dh",
      icon: "money-bill",
      iconColor: "bg-gray-700",
      valuePaths: ["capital", "warehousing_in"],
    },
    valueFormatter: currencyFormatter,
    antiFilters: ["client_id", "warehouse_id", "deliverer_id"],
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
];

function Dashboard2(props) {
  return (
    //
    <StatsDashboard
      schema={adminSchema}
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
