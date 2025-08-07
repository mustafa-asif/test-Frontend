import { Fragment } from "react";
import { Button, IconButton } from "../shared/Button";
import { Card } from "../shared/Card";
import { ClientDisplay } from "../shared/ClientDisplay";
import { WarehouseDisplay } from "../shared/WarehouseDisplay";
import { Copyable } from "../shared/Copyable";
import { HumanDate } from "../shared/HumanDate";
import { UserDisplay } from "../shared/UserDisplay";
import { fmtDate, imgSrc, IMG_GET_URL } from "../../utils/constants";
import { useQuickEditor } from "../shared/ToolsProvider";
import { getMostRecentTimestamp } from "../../utils/misc";

export const PaymentsCard = ({
  _id,
  timestamps,
  from,
  to,
  status,
  amount,
  created_by,
  description,
  bonus,
  medium,
  file,
  type,
  ...props
}) => {
  const [isSaving, editDocument, removeDocument] = useQuickEditor(_id, "invoices");
  const mAmount = to?.account === "client" ? -amount.toFixed(2) : amount.toFixed(2);
  return (
    <Card
      backgroundColor={
        status === "fulfilled" ? (mAmount > 0 ? "bg-green-200" : "bg-red-200") : "bg-white"
      }
      loading={isSaving}>
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-full text-sm font-light text-gray-400 hover:text-green-500 flex items-center col-span-2 -mt-1 cursor-pointer">
          <Copyable text={_id} />
        </div>
        <div className="rounded-full text-sm font-light text-gray-400 flex items-center col-span-2 justify-end -mt-1">
          <HumanDate date={getMostRecentTimestamp(timestamps)} long />
        </div>
        {to?.account === "client" && <ClientDisplay client={to.client} />}
        {from?.account === "warehouse" && (
          <WarehouseDisplay warehouse={from.warehouse} fullWidth={true} />
        )}
        {created_by && <UserDisplay user={created_by} />}
        <div className="col-span-4">
          {bonus && (
            <span
              className={`h-10 mr-1 px-3 font-bold rounded-full ${
                amount > 0 ? "bg-red-100 text-red-500" : "bg-green-100 text-green-500"
              }`}>
              BONUS
            </span>
          )}
          {description}
        </div>
        {type === "admin" && (
          <div className="col-span-4 flex justify-between">
            <div className="flex gap-x-1 items-center">
              <i className={`fas fa-${medium === "bank" ? "university" : "hand-holding-usd"}`}></i>
              <p>{medium}</p>
            </div>
            <a href={imgSrc(file)} download={file} target="_blank">
              <IconButton icon="download" iconColor="green" />
            </a>
          </div>
        )}
        <Button btnColor={getColor(status)} className="col-span-4">
          <i className={`fas fa-${getIcon(status)} pr-2`}></i>
          <span>{mAmount}</span>
          <span className="font-semibold text-xs ml-1 mt-1">DH</span>
        </Button>
        {status === "draft" && created_by.role !== "payman" && (
          <Fragment>
            <Button
              className="col-span-2"
              label="Accepter"
              onClick={() => {
                editDocument({ status: "fulfilled" }, "confirm");
              }}
            />
            <Button
              className="col-span-2"
              btnColor="red"
              label="Supprimer"
              onClick={() => removeDocument()} // because of event
            />
          </Fragment>
        )}
        {status === "draft" && created_by.role === "payman" && (
          <div className="col-span-4">
            <p className="text-center text-gray-400">recu par livreur de validation par admin</p>
          </div>
        )}
        {status === "fulfilled" && (
          <div className="col-span-4 flex justify-center items-center relative w-full px-2 py-2 rounded-full bg-gray-100 text-green-500 font-bold outline-none tracking-wide">
            {fmtDate(getMostRecentTimestamp(timestamps))}
          </div>
        )}
      </div>
    </Card>
  );
};

function getColor(status) {
  if (status === "fulfilled") return "green";
  if (status === "cancelled") return "red";
  return "yellow";
}

function getIcon(status) {
  if (status === "fulfilled") return "check";
  if (status === "cancelled") return "times";
  return "clock";
}
