import { Copyable } from "../shared/Copyable";
import { ClientDisplay } from "../shared/ClientDisplay";
import { CardDatePicker } from "../shared/CardDatePicker";
import { TargetDisplay } from "../shared/TargetDisplay";
import { ProductsDisplay } from "../shared/ProductsDisplay";
import { HumanDate } from "../shared/HumanDate";
import { Card } from "../shared/Card";
import { useQuickEditor } from "../shared/ToolsProvider";
import { Pin } from "../shared/Pin";
import { getMostRecentTimestamp } from "../../utils/misc";
import { ActionsMenu } from "../shared/ActionsMenu";
import { MessagesButton } from "../shared/MessagesButton";

export const ReturnCard = ({
  _id,
  timestamps,
  description,
  kind = "onsite",
  target,
  products,
  status = "fulfilled",
  desired_date,
  messages,
  items
}) => {
  const [isSaving, editDocument] = useQuickEditor(_id, "purges");

  return (
    <Card loading={isSaving}>
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-full text-sm font-light text-gray-400 hover:text-green-500 flex items-center col-span-2 -mt-1">
          <Copyable text={_id} />
        </div>
        <div className="rounded-full text-sm font-light text-gray-400 flex items-center col-span-2 justify-end -mt-1">
          <HumanDate date={getMostRecentTimestamp(timestamps)} long />
        </div>

        {kind === "delivered" && <TargetDisplay target={target} status={status} />}

        {products?.length > 0 && <ProductsDisplay products={products} showRefrs />}
        <div className="col-span-4">{description}</div>

        {/* Quantity of return items */}
        <div className={`relative rounded-full h-10 flex items-center justify-center px-2 shadow-sm bg-gray-100 text-green-500`}>
          {items.length}
        </div>
        {/* Quantity of return items */}

        <MessagesButton messages={messages} status={status} link={`/returns/${_id}/chat`} />

        {kind === "delivered" && (
          <CardDatePicker
            date={desired_date}
            editDocument={editDocument}
            disabled={isSaving || timestamps.cancelled || timestamps.fulfilled}
            _id={_id}
            model="purges"
            opensMessages={typeof status === "string"} // certain statuses
          />
        )}

        {kind === "onsite" && (
          <div className="rounded-full h-10 flex items-center gap-[5px] col-span-3 bg-gray-100 shadow-sm justify-center capitalize">
            <i className="fas fa-warehouse pr-1"></i>
            {"sur place"}
          </div>
        )}
        {kind === "delivered" && (
          <div className="rounded-full h-10 flex items-center gap-[5px] col-span-2 bg-gray-100 shadow-sm justify-center capitalize">
            <i className="fas fa-motorcycle pr-1"></i>
            {"livraison"}
          </div>
        )}
        <ActionsMenu
          _id={_id}
          editDocument={editDocument}
          model="purges"
          status={status}
          cancelled={status === "pending"}
          history={false}
        />
      </div>
    </Card>
  );
};
