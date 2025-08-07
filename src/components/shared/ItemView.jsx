import { useStoreState } from "easy-peasy";
import { useLang } from "../../i18n/provider";
import { getColorConf, getIconConf } from "../../utils/styles";
import { ClientDisplay } from "../shared/ClientDisplay";
import { ProductsDisplay } from "../shared/ProductsDisplay";
import { IconButton } from "./Button";
import { Card } from "./Card";
import { Copyable } from "./Copyable";
import { EventComponent } from "./EventsView";
import { usePrint } from "../shared/ToolsProvider";
import { Fragment } from "react";
import { JsonViewButton } from "./JsonViewer";
import { Link } from "react-router-dom";
import { cl } from "../../utils/misc";

export const ItemView = ({
  status,
  product,
  client,
  warehouse,
  deliverer,
  events,
  _id,
  reserved_order,
  reserved_transfer,
  locked_order,
  replacement_order,
}) => {
  const color = getColorConf("items", status);
  const icon = getIconConf("items", status);

  const lang = useLang();
  const authUser = useStoreState((state) => state.auth.user);
  const showPrint = usePrint();

  function triggerPrint() {
    showPrint([{ _id: _id }]);
  }

  return (
    <Card>
      <div className="grid grid-cols-4 gap-x-3 gap-y-3">
        {/*  */}
        <IconButton icon={icon} className={`text-${color}`} />
        <div
          className={`md:col-span-2 text-xl text-${color} flex items-center justify-center gap-x-1`}>
          <Copyable text={_id} />
        </div>
        <IconButton icon="print" className="ml-auto" iconColor={"gray"} onClick={triggerPrint} />
        {/*  */}
        <ClientDisplay client={client} />
        <ProductsDisplay products={[{ product: product }]} />
        {/*  */}
        <div className="flex col-span-4">
          {warehouse && (
            <div className="flex-1 rounded-full h-10 flex items-center justify-center text-white bg-gray-700 hover:bg-gray-800 hover:text-green-500 shadow-sm hover:shadow-md transition duration-300">
              <p className="line-clamp-1 capitalize">{warehouse.city}</p>
            </div>
          )}
          {deliverer && (
            <div className="flex-1 rounded-full h-10 flex items-center justify-center text-white bg-gray-700 hover:bg-gray-800 hover:text-green-500 shadow-sm hover:shadow-md transition duration-300">
              <p className="line-clamp-1 capitalize">{deliverer.name}</p>
            </div>
          )}
        </div>
        {!["admin", "followup", "warehouse"].includes(authUser.role) ? null : (
          <ReservedView
            _id={_id}
            reserved_order={reserved_order}
            reserved_transfer={reserved_transfer}
          />
        )}

        {!["admin", "followup", "warehouse"].includes(authUser.role) ? null : (
          <LockedView locked_order={locked_order} />
        )}

        {["admin", "followup", "warehouse", "deliverer"].includes(authUser.role) &&
          replacement_order &&
          status !== "returned" && <ReplacedView replacement_order={replacement_order} />}

        <div
          className="col-span-4 overflow-y-scroll rounded-md bg-gray-100 p-3 h-[500px]"
          style={{ paddingBottom: 50 }}>
          <div className="flex flex-col ">
            {events.map((event) => (
              <EventComponent
                key={event._id}
                description={event[lang]}
                authUser={authUser}
                {...event}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

function ReservedView({ _id, reserved_order, reserved_transfer }) {
  return (
    <div className="col-span-4 flex justify-between items-center">
      <p className="text-gray-400 text-sm">
        DEBUG: Reserved for{" "}
        <span className="text-gray-600 font-bold">
          {!!reserved_order
            ? `order ${reserved_order._id}`
            : !!reserved_transfer
            ? `transfer ${reserved_transfer._id}`
            : "None"}
        </span>
      </p>
      <JsonViewButton model={"items"} _id={_id} />
    </div>
  );
}

function LockedView({ locked_order }) {
  return (
    <div className="col-span-4 flex justify-between items-center">
      <p className="text-gray-400 text-sm">
        DEBUG: <span className="text-red-500 font-bold">Locked</span> for{" "}
        <span
          className={cl("text-gray-600 font-bold", {
            "hover:text-gray-400 underline": !!locked_order,
          })}>
          {!!locked_order ? (
            <Link to={`/view/orders/${locked_order._id}`}>{locked_order._id}</Link>
          ) : (
            "None"
          )}
        </span>
      </p>
    </div>
  );
}

function ReplacedView({ replacement_order }) {
  return (
    <div className="col-span-4 flex justify-between items-center">
      <p className="text-yellow-700 text-sm">
        Cet article doit être retournée au client. La commande a été remplacée par une autre
        commande ({replacement_order._id}).
      </p>
    </div>
  );
}
