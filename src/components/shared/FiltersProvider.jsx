import { useContext, useState } from "react";
import { createContext } from "react";

const initialState = { filters: {}, setFilters: (filters) => { } };
const FiltersContext = createContext(initialState);

export const FiltersProvider = ({ children }) => {
  const [filters, setFilters] = useState({});
  return (
    <FiltersContext.Provider value={{ filters, setFilters }}>
      {/*  */}
      {children}
      {/*  */}
    </FiltersContext.Provider>
  );
};

export const usePersistantFilters = (model) => {
  const { filters, setFilters } = useContext(FiltersContext);

  const modelFilters = filters[model];
  const modelSetFilters = (value) => setFilters({ ...filters, [model]: value });

  return [modelFilters, modelSetFilters];
};
