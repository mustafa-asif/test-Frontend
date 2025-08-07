import { AutocompleteInput } from "./Input";

const allTags = ["all", "red", "yellow", "green", "blue", "gray", "none"];

export const TagsCombobox = ({ value, onValueChange }) => {
  return (
    <AutocompleteInput
      iconColor={["all", "none"].includes(value) ? `gray-400` : `${value}-300`}
      icon={"fa-circle"}
      value={value}
      getOptionLabel={(option) =>
        option === "all" ? "all tags" : option === "none" ? "no tags" : option
      }
      blurOnSelect
      onValueChange={onValueChange}
      options={allTags}
      className="cursor-pointer select-none flex-1"
      inputProps={{
        className: "flex-1 uppercase border-none select-none font-bold",
        readOnly: true,
      }}
      renderOption={(li, option) => {
        const color = ["all", "none"].includes(option) ? `text-gray-300` : `text-${option}-400`;
        const icon = "fa-circle";

        return (
          <li {...li}>
            <i className={`fas mr-2 ${icon} ${color} w-6 text-center`}></i>
            {option}
          </li>
        );
      }}
    />
    //
  );
};
