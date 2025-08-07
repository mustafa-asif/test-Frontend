import { useEffect, useState } from "react";
import { xFetch } from "../../utils/constants";
import { AutocompleteInput } from "./Input";

export const PackagingInput = ({ target_city = "", ...props }) => {
  const [packaging_types, setTypes] = useState([]);

  useEffect(() => {
    updateTypes();
  }, []);

  async function updateTypes() {
    let query = target_city ? `target_city=${target_city}` : "";
    const { data, error } = await xFetch(
      `/input_options/packaging`,
      undefined,
      undefined,
      undefined,
      [query]
    );
    if (error) return console.warn(error);
    setTypes(data);
  }

  function getOptionLabel(option) {
    const match = packaging_types.find((p) => p.type === option);

    return !match ? "" : `${match.type} (${match.fee} / item)`;
  }

  return (
    <AutocompleteInput
      options={[...packaging_types.map((p) => p.type)]}
      getOptionLabel={getOptionLabel}
      inputProps={{ placeholder: "Packaging Type" }}
      {...props}
    />
  );
};
