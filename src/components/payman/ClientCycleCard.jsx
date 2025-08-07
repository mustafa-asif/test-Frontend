import { useHistory, Link } from "react-router-dom";
import { fmtDate, MINIMUM_PAYOUT } from "../../utils/constants";
import { cl, formatBankNumber } from "../../utils/misc";
import { getColorConf, getIconConf } from "../../utils/styles";
import { Button, IconButton } from "../shared/Button";
import { Card } from "../shared/Card";
import { ClientDisplay } from "../shared/ClientDisplay";
import { Copyable } from "../shared/Copyable";
import { HumanDate } from "../shared/HumanDate";
import { Pic } from "../shared/Pic";
import { useQuickEditor, useSelected } from "../shared/ToolsProvider";
import { DownloadXls } from "../shared/DownloadXls";
import { PaymentInfo } from "./PaymentInfo";
import { Checkbox } from "@mui/material";
import { Fragment } from "react";

export const ClientCycleCard = ({ _id, timestamps, status, total, payments, to, payment_info }) => {
  const [isSaving, editDocument] = useQuickEditor(_id, "clientCycles");

  const [isSelected, setSelected, isSelecting] = useSelected(_id, "clientCycles");

  function toggleSelected() {
    if (isSaving) return;
    setSelected(!isSelected);
  }

  let displayStatus = status;

  if (status === "active") {
    if (total >= 100) displayStatus = "active-ready";
    else displayStatus = "active-low";
  }

  const isRecentlyChanged = checkRecentlyChanged(to.client.bank.last_updated);
  const requiresAcknowledge = isRecentlyChanged && !to.client.bank.update_acknowledged;

  function handleAcknowledgeChange() {
    editDocument({ update_acknowledged: true });
  }

  return (
    <Card
      className={cl({ "outline outline-red-300": requiresAcknowledge }, { outline: isSelected })}>
      <div className="grid grid-cols-4 gap-2">
        <div className="text-sm font-light text-gray-400 hover:text-green-500 flex items-center col-span-2 -mt-1">
          <Copyable text={_id} />
        </div>
        <div className="rounded-full text-sm font-light text-gray-400 flex items-center col-span-2 justify-end -mt-1">
          <HumanDate date={timestamps.started} long />
        </div>
        <div className="rounded-full h-10 text-sm font-semibold flex items-center col-span-4">
          <Pic image={to.client.brand?.logo} className="mr-1" />
          <span className="line-clamp-2">
            <Copyable text={`${to.client.brand?.name} (${to.client.user?.name})`} />
          </span>
        </div>

        <div className="flex col-span-4 items-center gap-x-[10px]">
          <div
            className={cl(
              "rounded-full h-10 font-bold flex items-center bg-gray-100 shadow-sm justify-center capitalize flex-1",
              { "text-red-500": requiresAcknowledge }
            )}>
            <Copyable text={to.client?.bank.number} />
          </div>
          {requiresAcknowledge && (
            <IconButton
              className="col-span-1"
              icon="thumbs-up"
              iconColor="red"
              onClick={handleAcknowledgeChange}
              disabled={isSaving}
            />
          )}
        </div>

        {status !== "paid" && (
          <Fragment>
            <Button
              className="col-span-4"
              disabled={
                status === "paid" ||
                total < MINIMUM_PAYOUT ||
                isSaving ||
                isSelecting ||
                requiresAcknowledge
              }
              onClick={() => editDocument({ status: "paid", total })}>
              <i className="fas fa-check mr-3"></i>Payment Made
            </Button>
          </Fragment>
        )}
        {status === "paid" && (
          <div className="col-span-4 flex justify-center items-center relative w-full px-2 py-2 rounded-full bg-gray-100 text-green-500 font-bold outline-none tracking-wide">
            {fmtDate(timestamps.paid)}
          </div>
        )}

        <div
          className={cl(
            "col-span-2 h-12 rounded-full flex items-center justify-center bg-white border-2 text-xl cursor-default",
            { "border-yellow-500 text-yellow-500": status !== "paid" },
            { "border-green-500 text-green-500": status === "paid" }
          )}>
          <i className={`fas ${getIconConf("clientCycles", displayStatus)} pr-2`}></i>
          <Copyable text={total.toLocaleString()} copyText={total} />
          <span className="font-semibold text-xs ml-1 mt-1">DH</span>
        </div>
        <div className="col-span-2 flex">
          <Link to={`/client-cycles/${_id}/payments`} className="flex-1 h-full">
            <Button btnColor={getColor(status)} className="h-full">
              <i className="fas fa-info-circle"></i>
            </Button>
          </Link>
          {status === "paid" && (
            <DownloadXls className="ml-1" filter={{ ids: getOrderIds(payments) }} />
          )}
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

function getOrderIds(payments) {
  const ids = [];
  for (const payment of payments) {
    if (payment.type !== "order" || !payment.order?._id || ids.includes(payment.order?._id)) {
      continue;
    }
    ids.push(payment.order._id);
  }
  return ids;
}

function checkRecentlyChanged(last_updated) {
  const now = new Date();
  const last_updated_date = new Date(last_updated);
  const diff = now - last_updated_date;
  return diff < 1000 * 60 * 60 * 24 * 3;
}
