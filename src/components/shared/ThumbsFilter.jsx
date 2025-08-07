import { useEffect, useRef, useState } from "react";
import { AutocompleteInput } from "./Input";
import { xFetch } from "../../utils/constants";
import { globalFilterToQuery } from "../../utils/misc";
import { getColorConf, getIconConf } from "../../utils/styles";
import { useTranslation } from "../../i18n/provider";
import { Dots } from "./Dots";

const allOptions = ["all", "up", "down"];

export const ThumbsFilter = ({ model, value, filter, onValueChange }) => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [counts, setCounts] = useState(null);
  const tl = useTranslation();
  const isOpenRef = useRef(false);
  const handleOpen = async () => {
    isOpenRef.current = true;
    if (counts) return;
    setLoading(true);
    const query = globalFilterToQuery({ ...filter, thumbs: "all" });
    const { data, error } = await xFetch(
      `/meta/${model}/thumbs`,
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

  return (
    <AutocompleteInput
      icon={"fa-thumbs-up"}
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
        const color = getColorConf("thumbs", option);
        const icon = getIconConf("thumbs", option);
        if (counts) {
          if (option === "all") {
            count = Object.values(counts).reduce((sum, number) => sum + number, 0);
          } else {
            count = counts?.[option] ?? 0;
          }
        }
        return (
          <li {...li}>
            <i className={`${icon} text-${color} mr-2 w-6 text-center`}></i>
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
