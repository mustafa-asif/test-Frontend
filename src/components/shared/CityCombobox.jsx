import { useState, useEffect } from "react";
import { AutocompleteInput } from "./Input";
import { useStoreState } from "easy-peasy";
import { MultipleCombobox } from "./MultipleCombobox";
import { cl } from "../../utils/misc";

export const CityCombobox = ({ getOptions, showComments, ...props }) => {
  const { cities, loading } = useStoreState((state) => state.cities);
  // const
  const options = getOptions?.(cities) || cities.map((city) => city.name);
  const warehouseComment = cities.find((city) => city.name === props.value)?.warehouseComment;
  return (
    //
    <div className="w-full flex flex-col">
      <AutocompleteInput options={options.sort()} displayArrows {...props} />
      {showComments && (
        <div
          className={cl(
            "flex-wrap w-max px-[10px] py-[2px] mt-[5px] min-h-[20px] rounded-full bg-blue-200 flex gap-x-[5px] items-center justify-center text-xs",
            { invisible: !warehouseComment }
          )}>
          <i className="opacity-60 fas fa-info-circle"></i>
          <div className="font-semibold">{warehouseComment}</div>
        </div>
      )}
    </div>
    //
  );
};

export const CityCombobox2 = ({ ...props }) => {
  const [options, setOptions] = useState([]);
  const user = useStoreState((state) => state.auth.user);

  async function getOptions() {
    if (user.role === "warehouse") {
      return setOptions([user.warehouse.city, ...user.warehouse.alt_cities]);
    }
    setOptions([]);
  }
  useEffect(() => {
    getOptions();
  }, []);
  return <MultipleCombobox options={options} {...props} />;
};
