import { useStoreState } from "easy-peasy";
import { useEffect, useState } from "react";
import { MultipleCombobox } from "./MultipleCombobox";

export const ZoneCombobox = ({ ...props }) => {
  const [options, setOptions] = useState([]);
  const user = useStoreState((state) => state.auth.user);

  async function getOptions() {
    if (user.role === "warehouse") {
      return setOptions([...user.warehouse.zones]);
    }
    setOptions([]);
  }
  useEffect(() => {
    getOptions();
  }, []);
  return <MultipleCombobox options={options} {...props} />;
};
