import { useRef, useState } from "react";
import { AutocompleteInput } from "./Input";
import { xFetch } from "../../utils/constants";
import { RatingIconsLables, globalFilterToQuery } from "../../utils/misc";
import { getColorConf, getIconConf } from "../../utils/styles";
import { Dots } from "./Dots";


const allOptions = ["all"].concat(Object.values(RatingIconsLables));

export const RatingFilter = ({ model, type, value, filter, icon, onValueChange }) => {
  const [isLoading, setLoading] = useState(false);
  const [counts, setCounts] = useState(null);
  const isOpenRef = useRef(false);
  const handleOpen = async () => {
    isOpenRef.current = true;
    if (counts) return;
    setLoading(true);
    const query = globalFilterToQuery({ ...filter, [type]: "all" });
    const { data, error } = await xFetch(
      `/meta/${model}/rating/${type}`,
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
  };

  const handleClose = () => {
    isOpenRef.current = false;
    resetCounts();
  };

  return (
    <AutocompleteInput
      icon={icon}
      value={value}
      blurOnSelect
      onValueChange={onValueChange}
      onOpen={handleOpen}
      onClose={handleClose}
      options={allOptions}
      className="cursor-pointer select-none flex-1"
      inputProps={{
        className: "flex-1 uppercase border-none select-none font-bold",
        readOnly: true,
      }}
      renderOption={(li, option) => {
        let count = 0;
        const color = getColorConf("rating", option);
        const icon = getIconConf("rating", option);
        if (counts) {
          if (option === "all") {
            count = Object.values(counts).reduce((sum, number) => sum + number, 0);
          } else {
            count = counts?.[option] ?? 0;
          }
        }
        return (
          <li {...li}>
            {option === "all" ? <span className={`${icon} mr-2 w-6 text-center`}></span> : <span className={`mr-2 w-6 text-center`}>{icon}</span>}
            {option?.toUpperCase()}
            {(counts || isLoading) && (
              <span className={`text-gray-400 ml-2`}>
                ({isLoading ? <Dots isAnimating speed={350} /> : count})
              </span>
            )}
          </li>
        );
      }}
    />
  );
};
