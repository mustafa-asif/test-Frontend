import { useEffect, useState } from "react";
import { xFetch } from "../../utils/constants";
import { AutocompleteInput } from "./Input";

export const UserSelect = ({ filters = [], ...props }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    updateUsers();
  }, []);

  async function updateUsers() {
    const { data, error } = await xFetch(`/users`, undefined, undefined, undefined, [
      "_show=name",
      ...filters,
    ]);
    if (error) return console.warn(error);
    setUsers(data);
  }

  function getOptionLabel(option) {
    const user = users.find((u) => u._id === option);
    if (user) return `${user.name} (${user._id})`;
    return "none";
  }

  return (
    <AutocompleteInput
      options={["", ...users.map((u) => u._id)]}
      getOptionLabel={getOptionLabel}
      {...props}
    />
  );
};
