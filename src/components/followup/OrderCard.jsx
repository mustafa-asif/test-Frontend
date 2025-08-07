import { getOrderBg } from "../../utils/misc";
import { ActionsMenu } from "../shared/ActionsMenu";
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
import { getMostRecentTimestamp } from "../../utils/misc";
import { Tags } from "../shared/Tags";
import { JsonViewButton } from "../shared/JsonViewer";
import { WarehouseDisplay2, WarehouseDisplay3 } from "../shared/WarehouseDisplay";
import { CardSection } from "../shared/CardSection";
import { DelivererSelect } from "../shared/DelivererSelect";
import { OrderPaymentStatus } from "../shared/OrderPaymentStatus";
import { TrackedItems } from "../shared/TrackedItems";
import orderTraceService from "../../services/OrderTraceService";
import { useStoreState } from "easy-peasy";

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
  warehouse,
  deliverer,
  tags,
  locked_items,
  payments_made,
  tracked_items,
  replacing_order,
  replacement_order,
  ...rest
}) => {
  const user = useStoreState((state) => state.auth.user);
  const [isSaving, editDocumentEditor, deleteDocument] = useQuickEditor(_id, "orders");
  const { transfer } = rest;

  const transfer_status = transfer?.status || "pending";

  const editDocument = async (changes) => {
    await orderTraceService.traceOrderChange(
      _id,
      "[FollowupDashboard.OrderCard]:: Order changed",
      { status, target, cost },
      changes,
      user
    );

    editDocumentEditor(changes);
  };

  return (
    <Card loading={isSaving} backgroundColor={`${getOrderBg(timeline)}`}>
      <div className="grid grid-cols-4 gap-2">
        <div className="col-span-4 flex justify-between items-center whitespace-nowrap gap-x-1">
          <div className="flex gap-x-2 items-center">
            <span className="font-light text-gray-400 hover:text-green-500">
              <Copyable text={_id} />
            </span>
            <Tags
              value={tags}
              onChange={(tags) => editDocument({ tags })}
              isLoading={isSaving}
              canEdit
              canRemove
            />
          </div>
          <div className="flex gap-x-1 items-center">
            <span className="text-sm text-light text-gray-400">
              <HumanDate date={getMostRecentTimestamp(timestamps)} long />
            </span>
            <Pin value={pinned} onChange={(pinned) => editDocument({ pinned })} />
            <JsonViewButton model="orders" _id={_id} />
          </div>
        </div>

        {replacing_order && (
          <div className="col-span-4 rounded-full h-10 flex items-center col-span-4 bg-white border-2 border-dashed border-blue-200 text-xl text-gray-400 cursor-default">
            <p className="text-center text-sm flex-1">
              Commande pour remplacer <span className="underline">{replacing_order._id}</span>
            </p>
          </div>
        )}
        <CardSection label="Customer">
          <TargetDisplay target={target} status={status} showComments hideNumber />
        </CardSection>

        <CardSection label="Products">
          <ProductsDisplay
            products={products}
            locked_items={locked_items}
            order_id={_id}
            order_status={status}
          />
          {["cancelled", "refused", "draft"].includes(status) &&
            tracked_items &&
            tracked_items.length > 0 && <TrackedItems tracked_items={tracked_items} />}
        </CardSection>

        {replacement_order && (
          <div className="col-span-4 rounded-full h-10 flex items-center col-span-4 bg-white border-2 border-dashed border-yellow-200 text-xl text-gray-400 cursor-default">
            <p className="text-center text-sm flex-1">
              Commande a été remplacée par{" "}
              <span className="underline">{replacement_order._id}</span>
            </p>
          </div>
        )}

        <CardSection label="Client">
          <ClientDisplay client={client} />
        </CardSection>

        {warehouse && (
          <CardSection label="Warehouse">
            <WarehouseDisplay3 warehouse={warehouse} />
          </CardSection>
        )}

        {warehouse && (
          <CardSection label="Deliverer">
            <DelivererSelect
              _id={_id}
              model={"orders"}
              status={status}
              deliverer={deliverer}
              warehouse_id={warehouse._id}
            />
          </CardSection>
        )}

        {status === "fulfilled" && typeof payments_made === "boolean" && (
          <OrderPaymentStatus payments_made={payments_made} />
        )}
        <MessagesButton messages={messages} status={status} link={`/orders/${_id}/chat`} />
        <CardDatePicker
          date={desired_date}
          editDocument={editDocument}
          disabled={isSaving || timestamps.cancelled || timestamps.fulfilled}
          _id={_id}
          model="orders"
          opensMessages={typeof status === "string"} // certain statuses
        />
        <CostDisplay cost={cost} />
        <ActionsMenu
          _id={_id}
          editDocument={editDocument}
          deleteDocument={deleteDocument}
          model="orders"
          opensMessages={["cancelled", "draft"]}
          status={status}
          draft={
            (status === "awaiting pickup" ||
              status === "awaiting transfer" ||
              status === "pending" ||
              status === "problem" ||
              status === "cancelled" ||
              status === "refused" ||
              status === "deleted" ||
              status === "postponed" ||
              status === "returned-fully" ||
              status === "returned-warehouse" ||
              status === "returned-started" ||
              status === "returned-pending") &&
            transfer_status !== "in progress"  // Hide draft button if transfer_status is in progress
          }
          pending={
            status === "draft" ||
            status === "problem" ||
            status === "awaiting pickup" ||
            status === "awaiting transfer"
          }
          problem={status === "pending" || status === "problem"}
          inprogress={status === "fulfilled"}
          edit={
            !["fulfilled", "cancelled", "refused", "deleted", "awaiting transfer"].includes(status)
          }
          cancelled={
            (status === "draft" ||
              status === "awaiting pickup" ||
              status === "awaiting transfer" ||
              status === "pending" ||
              status === "problem") &&
            transfer_status !== "in progress"  // Hide cancelled button if transfer_status is in progress
          }
        />
      </div>
    </Card>
  );
};
