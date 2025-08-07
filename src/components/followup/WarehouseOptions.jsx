import { useEffect } from "react";
import { useContext, useState } from "react";
import { createContext } from "react";
import { xFetch } from "../../utils/constants";

const context = createContext({
  options: [],
});

export const WarehouseOptions = ({ children }) => {
  const [options, setOptions] = useState([]);

  async function fetchWarehouses() {
    const { data, error } = await xFetch("/input_warehouses/options");
    if (error) return console.log(error);
    if (data) setOptions(data);
  }

  useEffect(() => {
    fetchWarehouses();
  }, []);

  return <context.Provider value={{ options }}>{children}</context.Provider>;
};

export const useWarehouseOptions = () => {
  return useContext(context);
};
