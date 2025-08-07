import { useTranslation } from "../../i18n/provider";
import { AutocompleteInput } from "../shared/Input";
import { useState } from "react";

const options = [
  { label: "all", id: "all" },
  { label: "less than 1 day", id: "less_than_1_day" },
  { label: "1 to 7 days", id: "1_to_7_days" },
  { label: "7 to 14 days", id: "7_to_14_days" },
  { label: "14 to 21 days", id: "14_to_21_days" },
  { label: "21 to 30 days", id: "21_to_30_days" },
  { label: "more than 30 days", id: "more_than_30_days" }
];

export const InventoryScanFilter = ({ model, value, onValueChange }) => {
  const tl = useTranslation();
  const [displayValue, setDisplayValue] = useState(value);

  return (
    <AutocompleteInput
      iconColor={getColor(value)}
      icon={"fa-clock"}
      value={displayValue}
      blurOnSelect
      onValueChange={(selectedOption) => {
        onValueChange(selectedOption.id);
        setDisplayValue(selectedOption.label);
      }}
      options={options}
      className="cursor-pointer select-none flex-1"
      inputProps={{
        className: "flex-1 uppercase border-none select-none font-bold",
        readOnly: true,
      }}
      renderOption={(li, option) => {
        const color = getColor(option.id);
        return (
          <li {...li}>
            <i className={`fas mr-2 fa-clock text-${color} w-6 text-center`}></i>
            {option.label.toUpperCase()}
          </li>
        );
      }}
    />
  );
};

function getColor(option) {
  switch (option) {
    case "all":
      return "gray-600";
    case "less_than_1_day":
      return "green-600";
    case "1_to_7_days":
      return "blue-600";
    case "7_to_14_days":
      return "yellow-600";
    case "14_to_21_days":
      return "orange-600";
    case "21_to_30_days":
      return "red-600";
    case "more_than_30_days":
      return "red-800";
    default:
      return "gray-600";
  }
} 