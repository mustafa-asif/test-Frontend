import { Link } from "react-router-dom";
import { Button, IconButton } from "../shared/Button";
import { Card } from "../shared/Card";
import { Copyable } from "../shared/Copyable";
import { HumanDate } from "../shared/HumanDate";
import { cl, getMostRecentTimestamp } from "../../utils/misc";
import { DownloadCycleBtn } from "./DownloadCycleBtn";

export const CycleCard = ({ _id, timestamps, status, total, pending, payments }) => {
  // const amount = total + pending;
  const amount = total;

  const numOrders = status === "paid" ? getOrderCount(payments) : 0;

  return (
    <Card>
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-full text-sm font-light text-gray-400 hover:text-green-500 flex items-center col-span-2 -mt-1">
          <Copyable text={_id} />
        </div>
        <div className="rounded-full text-sm font-light text-gray-400 flex items-center col-span-2 justify-end -mt-1">
          <HumanDate date={getMostRecentTimestamp(timestamps)} long />
        </div>
        <div
          className={cl(
            "col-span-4 flex items-center",
            { "text-yellow-600": status !== "paid" },
            { "text-green-600": status === "paid" }
          )}>
          <i className={`fas fa-${getIcon(status)} pr-2`}></i>
          {status !== "paid" && "En cours de paiement"}
          {status === "paid" && (
            <>
              Paiements Effectué ({numOrders} Commande{numOrders > 1 ? "s" : ""})
            </>
          )}
        </div>
        <div
          className={cl(
            "col-span-2 h-12 rounded-full flex items-center justify-center bg-white border-2 text-xl cursor-default",
            { "border-yellow-500 text-yellow-500": status !== "paid" },
            { "border-green-500 text-green-500": status === "paid" }
          )}>
          <span>{amount >= 0 ? amount.toLocaleString() : "0.00"}</span>
          <span className="font-semibold text-xs ml-1 mt-1">DH</span>
        </div>
        <div className="col-span-2 flex">
          <Link to={`/cycles/${_id}/payments`} className="flex-1 h-full">
            <Button btnColor={getColor(status)} className="h-full">
              <i className="fas fa-info-circle"></i>
            </Button>
          </Link>
          {status === "paid" && <DownloadCycleBtn className="ml-1" cycle_id={_id} />}
        </div>
      </div>
    </Card>
  );
};

function getIcon(status) {
  switch (status) {
    case "paid":
      return "check";
    case "active":
      return "hourglass";
    case "sent":
      return "clock";
    default:
      throw new Error("Unexpected Status ");
  }
}

function getColor(status) {
  switch (status) {
    case "paid":
      return "green";
    case "active":
      return "yellow";
    case "sent":
      return "yellow";
    default:
      throw new Error("Unexpected Status ");
  }
}

function getOrderCount(payments) {
  return payments.reduce((arr, payment) => {
    if (payment.type !== "order" || !payment.order || payment.status !== "fulfilled") return arr;
    const order_id = payment.order._id;
    if (arr.includes(order_id)) return arr;
    return [...arr, order_id];
  }, []).length;
}
