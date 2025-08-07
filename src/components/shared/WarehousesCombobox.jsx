import { useEffect, useState } from "react";
import { xFetch } from "../../utils/constants";
import { AutocompleteInput } from "./Input";

export const WarehousesCombobox = ({ ...props }) => {
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    updateWarehouses();
  }, []);

  async function updateWarehouses() {
    const { data, error } = await xFetch(`/input_warehouses`, undefined, undefined, undefined, [
      `_show=_id city`,
    ]);
    if (error) return console.warn(error);
    setWarehouses(data);
  }

  function getOptionLabel(option) {
    let label = option;
    const warehouse = warehouses.find((wa) => wa._id === option);
    if (warehouse?.city?.trim()) label = `${warehouse.city} (${warehouse._id})`;
    return label;
  }

  return (
    <AutocompleteInput
      options={warehouses.map((wa) => wa._id)}
      getOptionLabel={getOptionLabel}
      {...props}
    />
  );
};

// import { useEffect, useState } from "react";
// import { xFetch } from "../../utils/constants";
// import { AutocompleteInput } from "./Input";

// export const ClientsCombobox = ({ ...props }) => {
//   const [clients, setClients] = useState([]);

//   useEffect(() => {
//     updateClients();
//   }, []);

//   async function updateClients() {
//     const { data, error } = await xFetch(`/input_clients?_show='_id brand'`);
//     if (error) return console.warn(error);
//     setClients(data);
//   }

//   function getOptionLabel(option) {
//     let label = option;
//     const client = clients.find((cl) => cl._id === option);
//     if (client?.brand?.name?.trim()) label = `${client.brand.name} (${label})`;
//     return label;
//   }

//   return (
//     <AutocompleteInput
//       options={clients.map((cl) => cl._id)}
//       getOptionLabel={getOptionLabel}
//       {...props}
//     />
//   );
// };
