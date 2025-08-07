import { useEffect, useState } from "react";
import { xFetch } from "../../utils/constants";
import { AutocompleteInput } from "./Input";

export const ClientsCombobox = ({ ...props }) => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    updateClients();
  }, []);

  async function updateClients() {
    const { data, error } = await xFetch(`/input_clients`, undefined, undefined, undefined, [
      `_show=_id brand`,
    ]);
    if (error) return console.warn(error);
    setClients(data);
  }

  function getOptionLabel(option) {
    let label = option;
    const client = clients.find((cl) => cl._id === option);
    if (client?.brand?.name?.trim()) label = `${client.brand.name} (${label})`;
    return label;
  }

  return (
    <AutocompleteInput
      options={clients.map((cl) => cl._id)}
      getOptionLabel={getOptionLabel}
      {...props}
    />
  );
};
