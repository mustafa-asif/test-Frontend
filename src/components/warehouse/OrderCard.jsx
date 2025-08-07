import { ActionsMenuWO } from "../warehouse/ActionsMenuWO";
import { Copyable } from "../shared/Copyable";
import { ProductsDisplay } from "../shared/ProductsDisplay";
import { MessagesButton } from "../shared/MessagesButton";
import { HumanDate } from "../shared/HumanDate";
import { useQuickEditor } from "../shared/ToolsProvider";
import { CardDatePicker } from "../shared/CardDatePicker";
import { Pin } from "../shared/Pin";
import { CostDisplay } from "../shared/CostDisplay";
import { TargetDisplay } from "../shared/TargetDisplay";
import { ClientDisplay } from "../shared/ClientDisplay";
import { Card } from "../shared/Card";
import { fmtDate, getMostRecentTimestamp } from "../../utils/misc";
import { DelivererSelect } from "./DelivererSelect";
import { Tags } from "../shared/Tags";
import { usePrintOrders } from "../shared/PrintOrders";
import { ReturnItemsButton } from "./ReturnItemsButton";
import { useStoreState } from "easy-peasy";
import { Fragment } from "react";

export const OrderCard = ({
  _id,
  cost,
  target,
  products,
  status,
  client,
  desired_date,
  timestamps,
  timeline,
  messages,
  score,
  pinned,
  deliverer,
  tags,
  locked_items,
  isView,
  items_returned,
  replacing_order,
  replacement_order,
  ...rest
}) => {
  const [isSaving, editDocument, deleteDocument] = useQuickEditor(_id, "orders");
  const printOrders = usePrintOrders();
  const user = useStoreState((state) => state.auth.user);

  return (
    <Card loading={isSaving}>
      <div className="grid grid-cols-4 gap-2">
        <div className="col-span-4 flex items-center justify-between whitespace-nowrap">
          <div className="flex items-center gap-x-2">
            <span className="text-sm font-light text-gray-400 hover:text-green-500">
              <Copyable text={_id} />
            </span>
            <Tags
              value={tags}
              onChange={(tags) => editDocument({ tags })}
              isLoading={isSaving}
              canEdit
            />
          </div>
          <div className="flex items-center">
            <span className="text-sm font-light text-gray-400">
              <HumanDate date={getMostRecentTimestamp(timestamps)} long />
            </span>
            <Pin value={pinned} onChange={(pinned) => editDocument({ pinned })} />
          </div>
        </div>
        {replacing_order && (
          <div className="col-span-4 rounded-full h-10 flex items-center col-span-4 bg-white border-2 border-dashed border-blue-200 text-xl text-gray-400 cursor-default">
            <p className="text-center text-sm flex-1">
              Commande pour remplacer <span className="underline">{replacing_order._id}</span>
            </p>
          </div>
        )}
        <TargetDisplay target={target} status={status} showComments hideNumber />
        <ClientDisplay client={client} model={"orders"} />
        <ProductsDisplay products={products} />

        {replacement_order && (
          <div className="col-span-4 rounded-full h-10 flex items-center col-span-4 bg-white border-2 border-dashed border-yellow-200 text-xl text-gray-400 cursor-default">
            <p className="text-center text-sm flex-1">
              Commande a été remplacée par{" "}
              <span className="underline">{replacement_order._id}</span>
            </p>
          </div>
        )}

        <DelivererSelect _id={_id} model={"orders"} status={status} deliverer={deliverer} />

        {locked_items &&
          !replacement_order &&
          ["draft", "cancelled", "deleted", "refused", "returned-pending"].includes(status) &&
          !user.warehouse.main &&
          user.warehouse.options.lock_items && (
            <ReturnItemsButton _id={_id} alreadyCreated={items_returned} />
          )}

        {!user.warehouse.main && status === "fulfilled" && !!replacing_order && (
          <ReturnItemsButton _id={_id} alreadyCreated={items_returned} isForReplacing />
        )}

        <MessagesButton
          messages={messages}
          status={status}
          link={`${isView ? "/view" : ""}/orders/${_id}/chat`}
        />
        <CardDatePicker
          date={desired_date}
          editDocument={editDocument}
          disabled={isSaving || timestamps.cancelled || timestamps.fulfilled}
          _id={_id}
          model="orders"
          opensMessages={typeof status === "string"} // certain statuses
        />
        <CostDisplay cost={cost} />
        <ActionsMenuWO
          _id={_id}
          editDocument={editDocument}
          deleteDocument={deleteDocument}
          model="orders"
          status={status}
          pending={status === "in progress" || status === "problem" || status === "awaiting pickup"}
          fulfilled={status === "pending" || status === "problem"}
          cancelled={status === "awaiting pickup" || status === "pending" || status === "problem"}
          problem={status === "pending"}
          opensMessages={["cancelled", "refused", "draft"]}
          target={target}
          skipItemsOnFulfill={locked_items}
          isView={isView}
          print={status === "awaiting pickup" && locked_items ? printOrders : undefined}
        />
      </div>
    </Card>
  );
};
