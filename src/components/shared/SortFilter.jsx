import { useTranslation } from "../../i18n/provider";
import { sort_map } from "../../utils/misc";
import { AutocompleteInput } from "./Input";

export const SortFilter = ({ options = [], ...props }) => {
  const tl = useTranslation();

  return (
    <div style={{ width: 375 }}>
    <AutocompleteInput
      icon={"fa-sort"}
      iconColor="gray-500"
      options={options}
      getOptionLabel={(option) => {
        if (props.translate) {
          return tl(option);
        }

        let match = sort_map[option];
        if (!match) return option;
        return `${match.label} (${match.detail})`;
      }}
      placeholder="sort"
      className="cursor-pointer select-none flex-1"
      inputProps={{
        className: " flex-1 uppercase border-none select-none font-bold ",
        readOnly: true,
      }}
      value={props.translate ? tl(props.value) : props.value}
      {...props}
    />
    </div>
  );
};
