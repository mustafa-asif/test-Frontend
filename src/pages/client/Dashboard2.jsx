import { useStoreState } from "easy-peasy";
import { withCatch } from "../../components/shared/SafePage";
import { StatsDashboard } from "../../components/shared/StatsDashboard";
import { useTranslation } from "../../i18n/provider";
import { currencyFormatter, dateToMonth, fmtDate, getStatKeyColor } from "../../utils/misc";

function Dashboard2(props) {
  const tl = useTranslation();
  const isMainUser = useStoreState((state) => state.auth.user?.isMainUser);

  const clientSchema = [
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
        Object.keys(count)
          .filter((key) => !["completion_rate_orders", "active_orders"].includes(key))
          .map((key) => tl(key.replaceAll("_orders", "").replace("_", " "))),
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
      type: "linechart",
      props: {
        title: "orders_trend",
        valuePaths: ["previous_counts"],
      },
      getLabels: (val) =>
        val.map((data) => fmtDate(data.start_date) + " - " + fmtDate(data.end_date)),
      getDatasets: (previous_counts) => [
        {
          label: "livre",
          backgroundColor: "#65a30d",
          borderColor: "#65a30d",
          data: previous_counts.map((count) => count?.fulfilled_orders),
          fill: false,
        },
        {
          label: "actif",
          backgroundColor: "#86efac",
          borderColor: "#86efac",
          data: previous_counts.map((count) => count?.active_orders),
          fill: false,
        },
        {
          label: "annulé",
          backgroundColor: "#ef4444",
          borderColor: "#ef4444",
          data: previous_counts.map((count) => count?.cancelled_orders),
          fill: false,
        },
        {
          label: "refusé",
          backgroundColor: "#fca5a5",
          borderColor: "#fca5a5",
          data: previous_counts.map((count) => count?.refused_orders),
          fill: false,
        },
      ],
    },
  ];

  if (isMainUser) {
    clientSchema.push(
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
        props: { title: "financial_report", valuePaths: ["previous_capitals"] },
        getLabels: (val) => val.map((data) => dateToMonth(data.end_date)),
        getDatasets: (previous_capital) => [
          {
            label: "brute",
            data: previous_capital.map((capital) => capital.gross),
            backgroundColor: previous_capital.map((_) => "#ff0000"),
          },
          {
            label: "net",
            data: previous_capital.map((capital) => capital.net),
            backgroundColor: previous_capital.map((_) => "#f3f3f3"),
          },
        ],
      }
    );
  }
  return (
    //
    <StatsDashboard schema={clientSchema} initialFilters={{ from_date: null, to_date: null }} />
    //
  );
}

export default withCatch(Dashboard2);
