import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { cl } from "../../utils/misc";
import { AutocompleteInput } from "./Input";

export const DateFilter = ({ ...props }) => {
  const options = ["all time", "today", "last 3 days", "last 7 days", "last 30 days"];
  return (
    <AutocompleteInput
      icon={"fa-calendar"}
      iconColor="gray-500"
      {...props}
      options={options}
      placeholder=""
      className="cursor-pointer select-none flex-1"
      inputProps={{
        className: " flex-1 uppercase border-none select-none font-bold ",
        readOnly: true,
      }}
    />
  );
};

export const NewDateFilter = ({ className = "", label = "", value, onValueChange, ...props }) => {
  const defaultClass = `border border-gray-400 focus:border-green-500 transition-colors duration-200 px-3 text-gray-700 cursor-default bg-white rounded-full outline-none focus:outline-none focus:shadow-md hover:bg-gray-50 focus:bg-gray-50`;
  const defaultStyles = { height: 46, paddingLeft: 50 };
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MobileDatePicker
        inputFormat="MM/dd/yyyy"
        value={value}
        onChange={onValueChange}
        {...props}
        renderInput={(params) => {
          const { className: muClass = "", ...inputProps } = params.inputProps;
          return (
            <div className={cl("flex relative items-center", { "opacity-60": props.disabled })}>
              <button
                className={`absolute left-1 bg-gray-500 flex items-center justify-center`}
                style={{ height: 38, width: 38, borderRadius: 19 }}>
                <i className={`fas fa-calendar text-gray-100 text-xl`}></i>
              </button>
              <div ref={params.InputProps.ref}>
                <input
                  role="presentation"
                  autoComplete="off"
                  className={`${defaultClass} ${className}`.trim()}
                  style={{ ...defaultStyles }}
                  placeholder={`(${label}) mm/dd/yyyy`}
                  {...inputProps}
                  required={props.required}
                />
              </div>
            </div>
          );
        }}
      />
    </LocalizationProvider>
  );
};
