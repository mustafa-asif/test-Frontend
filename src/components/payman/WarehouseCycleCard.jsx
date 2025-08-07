import { Link } from "react-router-dom";
import { fmtDate } from "../../utils/constants";
import { Button } from "../shared/Button";
import { Card } from "../shared/Card";
import { Copyable } from "../shared/Copyable";
import { HumanDate } from "../shared/HumanDate";
import { useQuickEditor, useSelected } from "../shared/ToolsProvider";
import { WarehouseDisplay } from "../shared/WarehouseDisplay";
import { cl } from "../../utils/misc";
import { PaymentInfo } from "./PaymentInfo";
import { getColorConf, getIconConf } from "../../utils/styles";

export const WarehouseCycleCard = ({ _id, timestamps, status, total, from, payment_info }) => {
  const [isSaving, editDocument] = useQuickEditor(_id, "warehouseCycles");

  const [isSelected, setSelected, isSelecting] = useSelected(_id, "warehouseCycles");

  let displayStatus = status;

  if (status === "paid") {
    if (payment_info) displayStatus = "paid-justified";
    else displayStatus = "paid-unjustified";
  }

  function toggleSelected() {
    if (isSaving) return;
    setSelected(!isSelected);
  }

  return (
    <Card>
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-full text-sm font-light text-gray-400 hover:text-green-500 flex items-center col-span-2 -mt-1">
          <Copyable text={_id} />
        </div>
        <div className="rounded-full text-sm font-light text-gray-400 flex items-center col-span-2 justify-end -mt-1">
          <HumanDate date={timestamps.started} long />
        </div>
        <WarehouseDisplay warehouse={from.warehouse} fullWidth={true} />
        {/* <Link to={`/warehouse-cycles/${_id}/payments`} className="col-span-4">
          <Button btnColor={getColorConf("warehouseCycles", displayStatus)}>
            <i className={`fas ${getIconConf("warehouseCycles", displayStatus)} pr-2`}></i>
            <span>{total.toFixed(2)}</span>
            <span className="font-semibold text-xs ml-1 mt-1">DH</span>
          </Button>
        </Link> */}
        {status !== "paid" && (
          <Button
            className="col-span-4"
            disabled={status !== "sent" || isSaving || isSelecting}
            onClick={() => editDocument({ status: "paid", total })}>
            <i className="fas fa-check mr-3"></i>
            {status === "sent" ? "Payment Made" : "Awaiting payment"}
          </Button>
        )}
        {status === "paid" && (
          <div className="col-span-4 flex justify-center items-center relative w-full px-2 py-2 rounded-full bg-gray-100 text-green-500 font-bold outline-none tracking-wide">
            {fmtDate(timestamps.paid)}
          </div>
        )}
        {status === "paid" && (
          <div className="col-span-4">
            <PaymentInfo cycle_id={_id} payment_info={payment_info} />
          </div>
        )}

        <div
          className={cl(
            "col-span-2 h-12 rounded-full flex items-center justify-center bg-white border-2 text-xl cursor-default",
            { "border-yellow-500 text-yellow-500": displayStatus !== "paid-justified" },
            { "border-green-500 text-green-500": displayStatus === "paid-justified" }
          )}>
          <i className={`fas ${getIconConf("warehouseCycles", displayStatus)} pr-2`}></i>
          <Copyable text={total.toLocaleString()} copyText={total} />
          <span className="font-semibold text-xs ml-1 mt-1">DH</span>
        </div>
        <div className="col-span-2 flex">
          <Link to={`/warehouse-cycles/${_id}/payments`} className="flex-1 h-full">
            <Button btnColor={getColor(status)} className="h-full">
              <i className="fas fa-info-circle"></i>
            </Button>
          </Link>
        </div>
      </div>
      {isSelecting && (
        <div
          onClick={toggleSelected}
          className={cl(
            "absolute top-0 bottom-0 right-0 left-0 z-50 cursor-pointer",
            { "bg-blue-300/10 hover:bg-blue-300/20": !isSelected },
            { "bg-blue-300/30 hover:bg-blue-300/40": isSelected }
          )}></div>
      )}
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
