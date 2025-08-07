import { useEffect, useState } from "react";
import { AutocompleteInput } from "./Input";
import { xFetch } from "../../utils/constants";
import { globalFilterToQuery } from "../../utils/misc";

const allTags = ["all", "awaiting client message"];

export const ActionFilter = ({ model, value, filter, onValueChange }) => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [displayRedEyeCatcher, setDisplayRedEyeCatcher] = useState(false);
  const [counts, setCounts] = useState(null);
  async function fetchCount() {
    if (isLoading) return;
    setLoading(true);
    const query = globalFilterToQuery({ ...filter, action: allTags[1] });
    const { data, error } = await xFetch(
      `/meta/${model}/status`,
      undefined,
      undefined,
      undefined,
      query
    );
    if (Object.keys(data).length) {
      setDisplayRedEyeCatcher(true);
      setCounts(data);
    }
    setLoading(false);
    if (error) return setError(error);
  }

  useEffect(() => {
    fetchCount();
  }, [filter])

  return (
    <AutocompleteInput
      icon={"fa-clock"}
      value={value}
      blurOnSelect
      onValueChange={onValueChange}
      options={allTags}
      className="cursor-pointer select-none flex-1"
      inputProps={{
        className: "flex-1 uppercase border-none select-none font-bold",
        readOnly: true,
      }}
      displayRedEyeCatcher={displayRedEyeCatcher}
      renderOption={(li, option) => {
        let count = 0;
        if (counts) {
          count = Object.values(counts).reduce((sum, number) => sum + number, 0);
        }
        return (
          <li {...li}>
            <i className={`fas mr-2 w-6 text-center`}></i>
            {option?.toUpperCase()}
            {(
              <span className={`text-gray-400 ml-2`}>
                ({count})
              </span>
            )}
          </li>
        );
      }}
    />
  );
};
