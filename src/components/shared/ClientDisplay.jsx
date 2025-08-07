import { useEffect, useState } from "react";
import { xFetch } from "../../utils/constants";
import { Pic } from "../shared/Pic";
import { useStoreState } from "easy-peasy";

export const ClientDisplay = ({ client, model }) => {
  client.brand ??= { image: null, name: "client brand" };
  client.user ??= { phone: "0000000000", name: "user name" };
  const authUser = useStoreState((state) => state.auth.user);
  const [isWarehouseAllowed, setWarehouseAllowed] = useState(false);
  const isFollowup = authUser.role === "followup";
  const isWarehouse = authUser.role === "warehouse";

  //Fetching main user of client
  const fetchDocument = async () => {
    const { data } = await xFetch(`/clients/${client._id}/mainuser`);
    const isWarehouseAllowed = (model === "orders" && isWarehouse && data?.client?.display_client_team_member_contact && authUser.warehouse?.options?.display_client_team_member_contact);
    setWarehouseAllowed(isWarehouseAllowed);
  };

  useEffect(() => {
    if (model === "orders" && isWarehouse)
      fetchDocument();
  },[model,isWarehouse]);


  return (
    <div className="rounded-full h-10 flex items-center col-span-4 bg-gray-100 hover:bg-gray-200 hover:text-green-500 shadow-sm hover:shadow-md transition duration-300">
      <Pic image={client.brand.image} className="mr-3" />
      <a className="line-clamp-1" href={(isFollowup || isWarehouseAllowed) ? `tel:${client.user.phone}` : "#"}>
        {client.brand.name} {(isFollowup || isWarehouseAllowed) && "(" + client.user.name + ")"}
      </a>
      {(isFollowup || isWarehouseAllowed) && (
        <a
          href={`https://wa.me/212${+client.user.phone}`}
          target="_blank"
          rel="noreferrer"
          className="ml-auto mr-1">
          <i className="fab fa-whatsapp bg-green-500 text-white rounded-full p-1.5"></i>
        </a>
      )}
    </div>
  );
};
