import { getOrderBg } from "../../utils/misc";
import { ActionsMenu } from "../shared/ActionsMenu";
import { Copyable } from "../shared/Copyable";
import { ProductsDisplay } from "../shared/ProductsDisplay";
import { MessagesButton } from "../shared/MessagesButton";
import { HumanDate } from "../shared/HumanDate";
import { useQuickEditor } from "../shared/ToolsProvider";
import { CardDatePicker } from "../shared/CardDatePicker";
import { CostDisplay } from "../shared/CostDisplay";
import { TargetDisplay } from "../shared/TargetDisplay";
import { Card } from "../shared/Card";
import { getMostRecentTimestamp } from "../../utils/misc";
import { usePrintOrders } from "../shared/PrintOrders";
import { OrderPaymentStatus } from "../shared/OrderPaymentStatus";
import { getTrackedItemStatus, TrackedItems } from "../shared/TrackedItems";
import { Button } from "../shared/Button";
import { getHumanDate } from "../../utils/constants";
import { StatusDisplay } from "../shared/StatusDisplay";
import orderTraceService from "../../services/OrderTraceService";
import { useStoreState } from "easy-peasy";

export const OrderCard = ({
  _id,
  cost,
  target,
  products,
  status,
  desired_date,
  timestamps,
  timeline,
  messages,
  locked_items,
  payments_made,
  replacing_order,
  tracked_items,
  replacement_order,
  show_client,
  transfer
}) => {
  const user = useStoreState((state) => state.auth.user);
  const [isSaving, editDocumentEditor, deleteDocument] = useQuickEditor(_id, "orders");
  const transfer_status = transfer?.status || "pending";
  const printOrders = usePrintOrders();

  let displayStatus = status;

  if (["cancelled", "refused"].includes(status) && tracked_items?.length > 0) {
    const trackedStatus = getTrackedItemStatus(tracked_items[0]);
    if (trackedStatus !== "-") displayStatus = trackedStatus;
  }

  const editDocument = async (changes) => {
    await orderTraceService.traceOrderChange(
      _id,
      "[ClienDashboard.OrderCard]:: Order changed",
      { status, target, cost },
      changes,
      user
    );

    editDocumentEditor(changes);
  };

  return (
    <Card backgroundColor={`${getOrderBg(timeline)}`} loading={isSaving}>
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-full text-sm font-light text-gray-400 hover:text-green-500 flex items-center col-span-2 -mt-1 cursor-pointer w-max">
          <Copyable text={_id} />
        </div>
        <div className="rounded-full text-sm font-light text-gray-400 flex items-center col-span-2 justify-end -mt-1">
          <HumanDate date={getMostRecentTimestamp(timestamps)} long />
        </div>
        {replacing_order && (
          <div className="col-span-4 rounded-full h-10 flex items-center col-span-4 bg-white border-2 border-dashed border-blue-200 text-xl text-gray-400 cursor-default">
            <p className="text-center text-sm flex-1">
              Commande pour remplacer <span className="underline">{replacing_order._id}</span>
            </p>
          </div>
        )}

        <TargetDisplay target={target} status={status} showComments hideNumber />

        <ProductsDisplay products={products} tracked_items={tracked_items} />
        {["cancelled", "refused", "draft"].includes(status) &&
          tracked_items &&
          tracked_items.length > 0 && <TrackedItems tracked_items={tracked_items} />}

        {replacement_order && (
          <div className="col-span-4 rounded-full h-10 flex items-center col-span-4 bg-white border-2 border-dashed border-yellow-200 text-xl text-gray-400 cursor-default">
            <p className="text-center text-sm flex-1">
              Commande a été remplacée par{" "}
              <span className="underline">{replacement_order._id}</span>
            </p>
          </div>
        )}

        {show_client && (
          <div className="flex gap-x-[2px] col-span-4">
            <span className="text-red-600 h-6 min-w-6 px-[3px] text-sm rounded-full border border-solid flex items-center justify-center text-gray-800 border-gray-100 bg-gray-50">
              bien reçu
            </span>
          </div>
        )}

        {status === "fulfilled" && typeof payments_made === "boolean" && (
          <OrderPaymentStatus payments_made={payments_made} />
        )}

        {status === "draft" ? (
          <Button
            className="col-span-4 h-8 animate-pulse"
            icon="motorcycle"
            onClick={() => editDocument({ status: "pending" })}
            disabled={isSaving}>
            <span className="ml-[5px]">Expédier</span>
          </Button>
        ) : (
          <div className="col-span-4 h-8 hidden"></div>
        )}

        <div className="col-span-4">
          <StatusDisplay
            model="orders"
            status={displayStatus}
            className="bg-white/70 !w-full"
            date={getHumanDate(getMostRecentTimestamp(timestamps), true)}
          />
        </div>
        <MessagesButton messages={messages} status={status} link={`/orders/${_id}/chat`} />

        <CardDatePicker
          date={desired_date}
          editDocument={editDocument}
          _id={_id}
          model="orders"
          disabled={isSaving || timestamps.cancelled || timestamps.fulfilled}
        />

        <CostDisplay cost={cost} />

        <ActionsMenu
          _id={_id}
          editDocument={editDocument}
          deleteDocument={deleteDocument}
          model="orders"
          status={status}
          pending={status === "draft"}
          edit={status === "draft"}
          draft={status === "awaiting pickup" || status === "pending" || status === "problem" || transfer_status === "pending"}
          cancelled={transfer_status === "pending"}
          remove={
            status === "draft" ||
            status === "awaiting pickup" ||
            status === "pending" ||
            status === "problem" ||
            status === "cancelled"
          }
          print={status === "awaiting pickup" && locked_items ? printOrders : undefined}
          replace={status === "fulfilled" && !replacement_order}
        />
      </div>
    </Card>
  );
};
