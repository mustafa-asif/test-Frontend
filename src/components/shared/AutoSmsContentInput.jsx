import { Tooltip } from "@mui/material";
import { cl } from "../../utils/misc";

export function AutoSmsContentInput({ value, onValueChange, disabled, required }) {
  return (
    <div className="relative">
      <textarea
        className={cl(
          "transition-colors duration-200 p-1 text-gray-700 cursor-default w-full bg-white border rounded-lg outline-none border-gray-400 focus:outline-none focus:border-green-500 focus:shadow-sm hover:bg-gray-50 focus:bg-gray-50 h-[100px]",
          { "!bg-gray-100 pointer-events-none": disabled }
        )}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        disabled={disabled}
        required={required}
      />
      <div className={cl("flex gap-[5px]", { invisible: disabled })}>
        {variables.map((vr) => (
          <Tooltip
            key={vr.label}
            onClick={() => {
              if (disabled) return;
              onValueChange(value + vr.label);
            }}
            title={vr.description}
            className="cursor-pointer">
            <div className="px-[5px] rounded-md bg-blue-100 text-blue-800">{vr.label}</div>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}

const variables = [
  { label: "$order", description: "ID of the order" },
  { label: "$product", description: "Name of the product" },
  { label: "$deliverer", description: "Name of the deliverer" },
  { label: "$customer", description: "Name of the customer" },
  { label: "$address", description: "Address of delivery" },
  { label: "$cost", description: "Amount to receive" },
];
