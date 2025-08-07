import { useStoreActions, useStoreState } from "easy-peasy";
import { useEffect, useState } from "react";
// import { editAnOrder } from "utils/orders";
// import { editAPickup } from "utils/pickups";
import { useToast } from "../../hooks/useToast";

export const AddressDisplay = ({ type, _id, address, status, ...props }) => {
  const [expanded, setExpanded] = useState(false);

  function toggleExpanded() {
    setExpanded(!expanded);
  }

  const long = address?.length > 30;

  return (
    <div
      className={`relative rounded-full ${expanded ? "" : "h-10"} ${
        long ? "cursor-pointer" : ""
      } col-span-2 flex gap-x-1 items-center`}
      onClick={long ? toggleExpanded : undefined}>
      <i className="fas fa-map-marker-alt"></i>
      <span className={`${expanded ? "" : "line-clamp-2"} capitalize`}>{address}</span>
    </div>
  );
};
