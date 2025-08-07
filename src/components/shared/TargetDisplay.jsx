import { Fragment, useState } from "react";
import { AddressDisplay } from "../shared/AddressDisplay";
import { WarehouseDisplay } from "../shared/WarehouseDisplay";
import { Whatsapp } from "./Whatsapp";
import { cl } from "../../utils/misc";
import { useStoreState } from "easy-peasy";
import { Tooltip } from "@mui/material";
import { CityCommentTooltip } from "./CityCommentTooltip";

// export const TargetDisplay = ({ target, status, warehouse }) => {
//   const [expanded, setExpanded] = useState(false);

//   return (
//     <Fragment>
//       <Whatsapp number={target.phone} />
//       <div className="rounded-full h-10 flex items-center col-span-2">
//         <span className="line-clamp-1">{target.name}</span>
//       </div>

//       <div
//         className="rounded-full h-10 flex items-center col-span-2 gap-2"
//         onClick={() => setExpanded((expanded) => !expanded)}>
//         <i className="fas fa-city"></i>
//         <span className="line-clamp-2 capitalize">{target.city}</span>
//       </div>

//       <AddressDisplay address={target.address} disabled={status === "fulfilled"} />

//       {expanded && warehouse && (
//         <Fragment>
//           <WarehouseDisplay warehouse={warehouse} />
//         </Fragment>
//       )}
//     </Fragment>
//   );
// };

export const TargetDisplay = ({ target, showComments, status, hideNumber }) => {
  return (
    <Fragment>
      <Whatsapp number={target.phone} hideNumber={hideNumber} />
      <div className="rounded-full h-10 flex items-center col-span-2">
        <span className="line-clamp-1">{target.name}</span>
      </div>

      <div className="col-span-4 justify-between gap-x-[10px] flex wrap ">
        <div className="h-10 flex items-center gap-[5px]">
          <i className="fas fa-city"></i>
          <span className="capitalize">{target.city}</span>
          {showComments && <CityCommentTooltip city={target.city} />}
        </div>

        <AddressDisplay address={target.address} disabled={status === "fulfilled"} />
      </div>
    </Fragment>
  );
};
