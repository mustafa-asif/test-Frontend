import { Link, useLocation } from "react-router-dom";
import { Button } from "./Button";
import { Card } from "./Card";
import { Copyable } from "./Copyable";
import { HumanDate } from "./HumanDate";
import { cl, getMostRecentTimestamp } from "../../utils/misc";
import { PaymentInfo } from "../payman/PaymentInfo";
import { getIconConf } from "../../utils/styles";
import { useTranslation } from "../../i18n/provider";
import { useStoreState } from "easy-peasy";
import { xFetch } from "../../utils/constants";
import { useConfirmation, useQuickEditor } from "./ToolsProvider";

export const CycleCard = ({ _id, timestamps, status, total, pending, payment_info, from }) => {
  const amount = total + pending;

  let displayStatus = status;
  const user = useStoreState((state) => state.auth.user);
  const tl = useTranslation();
  const confirmAction = useConfirmation();
  const location = useLocation();
  const isDelivererToWarehouseCycles = location.pathname.startsWith("/deliverers-cycles");

  const [isSaving, editDocument, deleteDocument, customEditDocument] = useQuickEditor(
    _id,
    "warehouse"
  );

  if (status === "paid") {
    if (payment_info) displayStatus = "paid-justified";
    else displayStatus = "paid-unjustified";
  }

  function markPaid() {
    if (!_id) return;
    const customFn = async () =>
      await xFetch(`/cycles/${_id}`, {
        method: "PATCH",
        body: { status: "paid", total: total },
      });
    function successFn(cycle) {
      console.log(`updated cycle `, cycle);
    }
    return confirmAction({
      title: `Livreur Payé ${total} DH`,
      onConfirm: () => customEditDocument(customFn, successFn),
    });
  }

  return (
    <Card>
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-full text-sm font-light text-gray-400 hover:text-green-500 flex items-center col-span-2 -mt-1">
          <Copyable text={_id} />
        </div>
        <div className="rounded-full text-sm font-light text-gray-400 flex items-center col-span-2 justify-end -mt-1">
          <HumanDate date={getMostRecentTimestamp(timestamps)} long />
        </div>

        {status === "paid" && (
          <div className="col-span-4">
            <PaymentInfo cycle_id={_id} payment_info={payment_info} disabled={user.role !== "warehouse" || !isDelivererToWarehouseCycles} />
          </div>
        )}

        <div
          className={cl(
            "col-span-2 h-12 rounded-full flex items-center justify-center bg-white border-2 text-xl cursor-default",
            { "border-yellow-500 text-yellow-500": displayStatus !== "paid-justified" },
            { "border-green-500 text-green-500": displayStatus === "paid-justified" }
          )}>
          <i className={`fas ${getIconConf("warehouseCycles", displayStatus)} pr-2`}></i>
          <Copyable text={amount.toLocaleString()} copyText={total} />
          <span className="font-semibold text-xs ml-1 mt-1">DH</span>
        </div>
        <div className="col-span-2 flex">
          <Link to={`/${!isDelivererToWarehouseCycles ? 'cycles' : 'deliverers-cycles'}/${_id}/payments`} className="flex-1 h-full">
            <Button btnColor={getColor(displayStatus)} className="h-full">
              <i className="fas fa-info-circle"></i>
            </Button>
          </Link>
        </div>

        {
          isDelivererToWarehouseCycles && from?.deliverer?.name && (
            <div className="rounded-full text-sm font-light text-gray-400 flex items-center col-span-4 -mt-1">
              {from?.deliverer?.name}
            </div>
          )
        }

        {status !== "paid" && user.role === "deliverer" &&
          <Button
            className="col-span-4"
            icon="check"
            btnColor="primary"
            label={tl("will_receive")}
            disabled={!(total > 0) || isSaving}
            onClick={markPaid}
          />}
        {/* <Link to={`/cycles/${_id}/payments`} className="col-span-4">
          <Button btnColor={getColor(status)}>
            <i className={`fas fa-${getIcon(status)} pr-2`}></i>
            <span>{amount >= 0 ? amount.toFixed(2) : "0.00"}</span>
            <span className="font-semibold text-xs ml-1 mt-1">DH</span>
          </Button>
        </Link> */}
      </div>
    </Card>
  );
};

// function getIcon(status) {
//   switch (status) {
//     case "paid":
//       return "check";
//     case "active":
//       return "hourglass";
//     case "sent":
//       return "clock";
//     default:
//       throw new Error("Unexpected Status ");
//   }
// }

function getColor(status) {
  switch (status) {
    case "paid-justified":
      return "green";
    default:
      return "yellow";
  }
}
