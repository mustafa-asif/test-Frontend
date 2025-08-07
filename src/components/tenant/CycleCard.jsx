import { Link } from "react-router-dom";
import { Button } from "../shared/Button";
import { Card } from "../shared/Card";
import { Copyable } from "../shared/Copyable";
import { HumanDate } from "../shared/HumanDate";
import { getMostRecentTimestamp } from "../../utils/misc";

export const CycleCard = ({ _id, timestamps, status, total, pending }) => {
  // const amount = total + pending;
  const amount = total;

  return (
    <Card>
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-full text-sm font-light text-gray-400 hover:text-green-500 flex items-center col-span-2 -mt-1">
          <Copyable text={_id} />
        </div>
        <div className="rounded-full text-sm font-light text-gray-400 flex items-center col-span-2 justify-end -mt-1">
          <HumanDate date={getMostRecentTimestamp(timestamps)} long />
        </div>
        <Link to={`/cycles/${_id}/payments`} className="col-span-4">
          <Button btnColor={getColor(status)}>
            <i className={`fas fa-${getIcon(status)} pr-2`}></i>
            <span>{amount >= 0 ? amount.toFixed(2) : "0.00"}</span>
            <span className="font-semibold text-xs ml-1 mt-1">DH</span>
          </Button>
        </Link>
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
