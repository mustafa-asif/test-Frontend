import { Link } from "react-router-dom";
import { fmtDate, MINIMUM_PAYOUT } from "../../utils/constants";
import { formatBankNumber } from "../../utils/misc";
import { Button } from "../shared/Button";
import { Card } from "../shared/Card";
import { Copyable } from "../shared/Copyable";
import { HumanDate } from "../shared/HumanDate";
import { Pic } from "../shared/Pic";
import { useQuickEditor } from "../shared/ToolsProvider";

export const TenantCycleCard = ({ _id, timestamps, status, total, to }) => {
  const [isSaving, editDocument] = useQuickEditor(_id, "tenantCycles");

  return (
    <Card>
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-full text-sm font-light text-gray-400 hover:text-green-500 flex items-center col-span-2 -mt-1">
          <Copyable text={_id} />
        </div>
        <div className="rounded-full text-sm font-light text-gray-400 flex items-center col-span-2 justify-end -mt-1">
          <HumanDate date={timestamps.started} long />
        </div>
        <div className="rounded-full h-10 text-sm font-semibold flex items-center col-span-4">
          <Pic image={to.tenant.styles?.logoIcon} className="mr-1" />
          <span className="line-clamp-2">
            {to.tenant.domain} ({to.tenant.user?.name})
          </span>
        </div>

        <div className="rounded-full h-10 font-bold flex items-center col-span-4 bg-gray-100 shadow-sm justify-center capitalize">
          <Copyable text={to.tenant?.bank.number} />
        </div>
        <Link to={`/tenant-cycles/${_id}/payments`} className="col-span-4">
          <Button btnColor={getColor(status)}>
            <i className={`fas fa-${getIcon(status)} pr-2`}></i>
            <span>{total.toFixed(2)}</span>
            <span className="font-semibold text-xs ml-1 mt-1">DH</span>
          </Button>
        </Link>
        {status !== "paid" && (
          <Button
            className="col-span-4"
            disabled={status === "paid" || total < MINIMUM_PAYOUT || isSaving}
            onClick={() => editDocument({ status: "paid", total })}>
            <i className="fas fa-check mr-3"></i>Payment Made
          </Button>
        )}
        {status === "paid" && (
          <div className="col-span-4 flex justify-center items-center relative w-full px-2 py-2 rounded-full bg-gray-100 text-green-500 font-bold outline-none tracking-wide">
            {fmtDate(timestamps.paid)}
          </div>
        )}
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
