import { useEffect, useRef, useState } from "react";
import { useTranslation } from "../../i18n/provider";
import { xFetch } from "../../utils/constants";
import { Dots } from "../shared/Dots";
import { AutocompleteInput } from "../shared/Input";
import { useWarehouseOptions } from "./WarehouseOptions";

export const WarehouseCombobox = ({ model, filter = {}, value, onValueChange }) => {
  const [isLoading, setLoading] = useState(true);
  const [counts, setCounts] = useState(null);
  const tl = useTranslation();

  const { options: warehouseOptions } = useWarehouseOptions();

  const [options, setOptions] = useState(["all"]);

  const isOpenRef = useRef(false);

  const expireRef = useRef();

  const handleOpen = async () => {
    isOpenRef.current = true;
    if (counts) return;
    setLoading(true);
    const { data, error } = await xFetch(
      `/meta/${model}/warehouse`,
      undefined,
      undefined,
      undefined,
      filterToQuery(filter)
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

  useEffect(() => {
    setOptions(["all", ...warehouseOptions.map((wh) => wh._id)]);
  }, [warehouseOptions.length]);

  // track count of current value; useEffect, once reaches 0 setFilter(all)

  const filteredOptions = (() => {
    if (!counts) return options;
    return options.filter((status) => !!counts[status] || status === "all" || value === status);
  })();
  return (
    //
    <AutocompleteInput
      iconColor={getColor(value)}
      icon={"fa-warehouse"}
      value={value}
      blurOnSelect
      getOptionLabel={(option) => {
        if (["all"].includes(option)) return tl(option)?.toUpperCase();
        const wh = warehouseOptions.find((wh) => wh._id === option);
        return wh ? `${wh.name}` : option;
      }}
      onValueChange={onValueChange}
      options={filteredOptions}
      onOpen={handleOpen}
      onClose={handleClose}
      className="cursor-pointer flex-1"
      inputProps={{
        className: " flex-1 uppercase border-none font-bold ",
      }}
      renderOption={(li, option) => {
        const color = getColor(option);
        const icon = getIcon(option);
        let count = 0;
        if (counts) {
          if (option === "all") {
            count = Object.values(counts)?.reduce((sum, number) => sum + number, 0);
          } else {
            count = counts?.[option] ?? 0;
          }
        }

        const label = (() => {
          if (["all"].includes(option)) return tl(option)?.toUpperCase();
          const wh = warehouseOptions.find((wh) => wh._id === option);
          return wh ? `${wh.name}` : option;
        })();

        return (
          <li {...li}>
            <i className={`fas mr-2 ${icon} text-${color} w-6 text-center`}></i>
            {label}
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
function filterToQuery(filter) {
  const query = [];

  if (filter.status && filter.status !== "all") {
    query.push(`status=${filter.status}`);
  }

  if (filter.supportCategory && filter.supportCategory !== "all") {
    query.push(`supportCategory=${filter.supportCategory}`);
  }

  if (filter.supportSubCategory && filter.supportSubCategory !== "all") {
    query.push(`supportSubCategory=${filter.supportSubCategory}`);
  }

  if (filter.keyword) {
    query.push(`keyword=${filter.keyword}`);
  }

  if (filter.date && filter.date !== "all time") {
    query.push(`date=${filter.date}`);
  }

  return query;
}

function getColor(option) {
  switch (option) {
    case "all":
      return "gray-600";
    case "none":
      return "red-400";
    default:
      return "green-600";
  }
}

function getIcon(option) {
  return "fa-warehouse";
}
