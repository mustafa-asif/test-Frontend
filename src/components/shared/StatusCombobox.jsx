import { useMemo, useRef, useState } from "react";
import { useTranslation } from "../../i18n/provider";
import { xFetch } from "../../utils/constants";
import { globalFilterToQuery, translateStatus } from "../../utils/misc";
import { getColorConf, getIconConf } from "../../utils/styles";
import { Dots } from "./Dots";
import { AutocompleteInput } from "./Input";

export const StatusCombobox = ({ model, filter, ...props }) => {
  const [isLoading, setLoading] = useState(true);
  const [counts, setCounts] = useState(null);
  const tl = useTranslation();

  const isOpenRef = useRef(false);

  const expireRef = useRef();

  const options = useMemo(() => {
    return getStatusOptions(model);
  }, [model]);

  const handleOpen = async () => {
    isOpenRef.current = true;
    if (counts) return;
    setLoading(true);
    const query = globalFilterToQuery({ ...filter, status: "all", deliverer_status: "all" });
    const { data, error } = await xFetch(
      `/meta/${model}/status`,
      undefined,
      undefined,
      undefined,
      query
    );
    setLoading(false);
    if (!isOpenRef.current) return;
    if (error) {
      console.log(error);
      return;
    }
    setCounts(data);
  };

  const resetCounts = () => {
    setLoading(true);
    setCounts(null);
    // clearTimeout(expireRef.current);
  };

  const handleClose = () => {
    isOpenRef.current = false;
    // expireRef.current = setTimeout(resetCounts, 5000);
    resetCounts();
  };

  // track count of current value; useEffect, once reaches 0 setFilter(all)
  return (
    //
    <AutocompleteInput
      icon={getIconConf(model, props.value)}
      iconColor={getColorConf(model, props.value)}
      {...props}
      options={options}
      onOpen={handleOpen}
      onClose={handleClose}
      className="cursor-pointer select-none flex-1"
      inputProps={{
        className: " flex-1 uppercase border-none select-none font-bold ",
        readOnly: true,
      }}
      getOptionLabel={(value) => translateStatus(model, value)}
      filterOptions={(options) => {
        if (!counts) return options;
        return options.filter(
          (status) => !!counts[status] || status === "all" || props.value === status || filter.show_deliverer_payments
        );
      }}
      renderOption={(li, option) => {
        const color = getColorConf(model, option);
        const icon = getIconConf(model, option);
        let count = 0;
        if (counts) {
          if (option === "all") {
            count = Object.values(counts).reduce((sum, number) => sum + number, 0);
          } else {
            count = counts?.[option] ?? 0;
          }
        }
        return (
          <li {...li}>
            <i className={`fas mr-2 ${icon} text-${color} w-6 text-center`}></i>
            {translateStatus(model, option)?.toUpperCase()}
            {(counts || isLoading) && (
              <span className={`text-gray-400 ml-2`}>
                ({isLoading ? <Dots isAnimating speed={350} /> : count})
              </span>
            )}
          </li>
        );
      }}
    />
    //
  );
};

function getStatusOptions(model) {
  switch (model) {
    case "orders":
      return [
        "all",
        "draft",
        "pending",
        "postponed",
        "in progress",
        "fulfilled",
        "problem",
        "refused",
        "cancelled",
        "awaiting pickup",
        "awaiting transfer",
        "pinned",
        "deleted",
        "returned-fully",
        "returned-warehouse",
        "returned-started",
        "returned-pending",
      ];
    case "pickups":
      return [
        "all",
        "pending",
        "problem",
        "postponed",
        "in progress",
        "fulfilled",
        "cancelled",
        "pinned",
        "deleted",
      ];
    case "transfers":
      return ["all", "pending", "in progress", "fulfilled", "cancelled", "pinned", "deleted"];
    case "purges":
      return ["all", "pending", "in progress", "fulfilled", "cancelled"];
    case "containers":
      return ["all", "pending", "sent", "arrived", "resolved", "discarded", "pinned", "resolved with problems"];
    case "cycles":
      return ["all", "active", "sent", "paid"];
    case "invoices":
      return ["all", "draft", "fulfilled", "cancelled", "admin"];
    case "clientCycles":
      return ["all", "active-ready", "active-low", "paid"];
    case "tenantCycles":
      return ["all", "active", , "paid"];
    case "warehouseCycles":
      return ["all", "active", "sent", "paid-justified", "paid-unjustified"];
    case "delivererToWarehouseCycles":
      return ["all", "active", "paid-justified", "paid-unjustified"];
    case "warehouses":
      return ["all", "active", "inactive", "deleted"];
    case "deliverers":
      return ["all", "active", "inactive", "deleted"];
    case "clients":
      return ["all", "active", "not verified", "inactive", "deleted", "unassigned", "assigned"];
    case "tickets":
      return ["all", "urgent", "opened", "stalled", "closed"];
    default:
      return [];
  }
}

// function filterToQuery(filter) {
//   const query = [];

//   if (filter.keyword) {
//     query.push(`keyword=${filter.keyword}`);
//   }

//   if (filter.date && filter.date !== "all time") {
//     query.push(`date=${filter.date}`);
//   }

//   if (filter.deliverer && filter.deliverer !== "all") {
//     query.push(`deliverer=${filter.deliverer}`);
//   }

//   if (filter.warehouse && filter.warehouse !== "all") {
//     query.push(`warehouse=${filter.warehouse}`);
//   }

//   if (filter.direction && filter.direction !== "all") {
//     if (filter.direction === "incoming") {
//       query.push(`to_warehouse._id=self`);
//     }

//     if (filter.direction === "outgoing") {
//       query.push(`from_warehouse._id=self`);
//     }
//   }

//   return query;
// }
