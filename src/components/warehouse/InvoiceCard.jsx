import { useStoreState } from "easy-peasy";
import { Button } from "../shared/Button";
import { Card } from "../shared/Card";
import { ClientDisplay } from "../shared/ClientDisplay";
import { Copyable } from "../shared/Copyable";
import { HumanDate } from "../shared/HumanDate";
import { useQuickEditor } from "../shared/ToolsProvider";
import { getMostRecentTimestamp } from "../../utils/misc";

export const InvoiceCard = ({
  _id,
  timestamps,
  amount,
  status,
  description,
  created_by,
  from,
  to,
  ...rest
}) => {
  const [isSaving, editDocument] = useQuickEditor(_id, "invoices");
  const warehouse_id = useStoreState((state) => state.auth.user.warehouse._id);
  const isInvoiceFromAdmin = from.warehouse?._id === warehouse_id;
  const toClient = to.account === "client";

  return (
    <Card loading={isSaving}>
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-full text-sm font-light text-gray-400 hover:text-green-500 flex items-center col-span-2 -mt-1">
          <Copyable text={_id} />
        </div>
        <div className="rounded-full text-sm font-light text-gray-400 flex items-center col-span-2 justify-end -mt-1">
          <HumanDate date={getMostRecentTimestamp(timestamps)} long />
        </div>

        {toClient && <ClientDisplay client={to.client} />}
        {isInvoiceFromAdmin && (
          <div
            className={`rounded-full h-10 flex items-center justify-center cursor-default col-span-4 font-bold shadow-sm select-none ${
              amount > 0 ? "bg-red-100 text-red-500" : "bg-green-100 text-green-500"
            }`}>
            {amount > 0 ? "de vous à Livo" : "de Livo à vous"}
          </div>
        )}
        <div className="col-span-4">{description}</div>
        <Button className="col-span-4" btnColor={getColor(status)} disabled>
          <i className={`fas fa-${getIcon(status)} pr-2`}></i>
          <span>{-amount.toFixed(2)}</span>
          <span className="font-semibold text-xs ml-1 mt-1">DH</span>
        </Button>
      </div>
    </Card>
  );
};

function getIcon(status) {
  switch (status) {
    case "fulfilled":
      return "check";
    case "draft":
      return "hourglass";
    default:
      throw new Error("Unexpected Status");
  }
}

function getColor(status) {
  switch (status) {
    case "fulfilled":
      return "green";
    case "draft":
      return "yellow";
    default:
      throw new Error("Unexpected status");
  }
}
