import { useEffect, useState } from "react";
import { useTranslation } from "../../i18n/provider";
import { AutocompleteInput } from "../shared/Input";
import { useStoreState } from "easy-peasy";

export const WarehouseUsersFilter = ({ model, value, onValueChange }) => {
  const tl = useTranslation();
  const documents = useStoreState((state) => state[model]?.[model] || []);
  const [users, setUsers] = useState([]);
  const [options, setOptions] = useState(["all"]);

  useEffect(() => {
    const uniqueUsers = new Map();
    documents.forEach(product => {
      product.items?.forEach(item => {
        if (item.lastEvent?.user) {
          const user = item.lastEvent.user;
          if (!uniqueUsers.has(user._id)) {
            uniqueUsers.set(user._id, user);
          }
        }
      });
    });
    
    const usersList = Array.from(uniqueUsers.values());
    setUsers(usersList);
    setOptions(["all", ...usersList.map(user => user._id)]);
  }, [documents]);

  return (
    <AutocompleteInput
      iconColor={getColor(value)}
      icon={"fa-user"}
      value={value}
      blurOnSelect
      getOptionLabel={(option) => {
        if (option === "all") return tl(option)?.toUpperCase();
        const user = users.find((u) => u._id === option);
        return user ? `${user.name}` : option;
      }}
      onValueChange={onValueChange}
      options={options}
      className="cursor-pointer flex-1"
      inputProps={{
        className: "flex-1 uppercase border-none font-bold",
      }}
      renderOption={(li, option) => {
        const color = getColor(option);
        const icon = getIcon(option);

        const label = (() => {
          if (option === "all") return tl(option)?.toUpperCase();
          const user = users.find((u) => u._id === option);
          return user ? `${user.name}` : option;
        })();

        return (
          <li {...li}>
            <i className={`fas mr-2 ${icon} text-${color} w-6 text-center`}></i>
            {label}
          </li>
        );
      }}
    />
  );
};

function getColor(option) {
  switch (option) {
    case "all":
      return "gray-600";
    default:
      return "blue-600";
  }
}

function getIcon(option) {
  return "fa-user";
} 