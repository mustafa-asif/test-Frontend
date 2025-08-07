import { Fragment } from "react";
import { useHistory, Link } from "react-router-dom";
import { getOrderBg } from "../../utils/misc";
import { ActionsMenu } from "../shared/ActionsMenu";
import { Copyable } from "../shared/Copyable";
import { ProductsDisplay } from "../shared/ProductsDisplay";
import { MessagesButton } from "../shared/MessagesButton";
import { HumanDate } from "../shared/HumanDate";
import { TargetDisplay } from "../shared/TargetDisplay";
import { Whatsapp } from "../shared/Whatsapp";
import { Card } from "../shared/Card";
import { useQuickEditor } from "../shared/ToolsProvider";
import { CardDatePicker } from "../shared/CardDatePicker";
import { getMostRecentTimestamp } from "../../utils/misc";
import { PackagingSelect } from "../shared/PackagingSelect";

export const PickupCard = ({
  _id,
  timestamps,
  type,
  target,
  products,
  messages,
  desired_date,
  timeline,
  status,
  warehouse,
  needs_packaging,
  packaging_type,
  items_count,
  events,
}) => {
  const [isSaving, editDocument, deleteDocument] = useQuickEditor(_id, "pickups");
  const sum = products?.reduce((count, product) => count + product.quantity, 0) || 0;

  return (
    <Card loading={isSaving}>
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-full text-sm font-light text-gray-400 hover:text-green-500 flex items-center col-span-2 -mt-1 cursor-pointer">
          <Copyable text={_id} />
        </div>
        <div className="rounded-full text-sm font-light text-gray-400 flex items-center col-span-2 justify-end -mt-1">
          <HumanDate date={getMostRecentTimestamp(timestamps)} long />
        </div>

        {target && <TargetDisplay target={target} status={status} />}

        {type === "free" && warehouse && (
          <Fragment>
            <Whatsapp number={"03030300303"} label="Warehouse" />
            <div className="rounded-full h-10 flex items-center col-span-2">
              <i className="fas fa-city pr-1"></i>
              <span className="line-clamp-2 capitalize">{warehouse.city}</span>
            </div>
          </Fragment>
        )}

        <ProductsDisplay products={products} showRefrs />
        {needs_packaging && <PackagingSelect value={packaging_type} disabled={isSaving} />}
        <MessagesButton messages={messages} status={status} link={`/pickups/${_id}/chat`} />
        <CardDatePicker
          date={desired_date}
          editDocument={editDocument}
          _id={_id}
          model="pickups"
          disabled={isSaving || timestamps.cancelled || timestamps.fulfilled}
        />

        {["fulfilled", "fulfilling"].includes(status) ? (
          <div className="rounded-full h-10 text-lg flex items-center col-span-1 font-bold bg-green-50 text-green-500 border border-solid border-green-100 justify-center">
            {sum ? sum : items_count ? `${items_count}` : "?"}
          </div>
        ) : (
          <div className="rounded-full h-10 text-lg flex items-center col-span-1 font-bold bg-yellow-50 text-yellow-500 border border-solid border-yellow-100 justify-center">
            {items_count ?? "?"}
          </div>
        )}

        <ActionsMenu
          _id={_id}
          editDocument={editDocument}
          deleteDocument={deleteDocument}
          model="pickups"
          status={status}
          edit={status === "pending"}
          remove={status === "cancelled" || status === "pending" || status === "problem"}
        />
      </div>
    </Card>
  );
};
