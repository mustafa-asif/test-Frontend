import { Copyable } from "../shared/Copyable";
import { HumanDate } from "../shared/HumanDate";
import { Card } from "../shared/Card";
import { useConfirmation, useQuickEditor } from "../shared/ToolsProvider";
import { Link } from "react-router-dom";
import { Button } from "../shared/Button";
import { xFetch } from "../../utils/constants";
import { getMostRecentTimestamp } from "../../utils/misc";
import { useTranslation } from "../../i18n/provider";

export const ShipperCard = ({ _id, name, timestamps, balance }) => {
  const confirmAction = useConfirmation();
  const tl = useTranslation();
  const [isSaving, editDocument, deleteDocument, customEditDocument] = useQuickEditor(_id, "shippers");

  function markPaid() {
    const customFn = async () =>
      await xFetch(`/shippers/${_id}`, {
        method: "PATCH",
        body: { balance: 0, last_payment: new Date() },
      });
    function successFn() {
      // maybe a toast?
    }
    return confirmAction({
      title: `Shipper Received ${balance} DH`,
      onConfirm: () => customEditDocument(customFn, successFn),
    });
  }

  return (
    <Card loading={isSaving}>
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-full text-sm font-light text-gray-400 hover:text-green-500 flex items-center col-span-2 -mt-1 cursor-pointer">
          <Copyable text={_id} />
        </div>

        <div className="rounded-full text-sm font-light text-gray-400 flex items-center col-span-2 justify-end -mt-1">
          <HumanDate date={getMostRecentTimestamp(timestamps)} long />
        </div>

        <div className="rounded-full h-10 text-sm font-semibold flex items-center col-span-3">
          <span className="line-clamp-2">{name}</span>
        </div>

        {/*  */}
        <Link to={`/shippers/${_id}/edit`}>
          <Button btnColor="gray" icon="pen" className="h-10" />
        </Link>

        <Link to={"#"} className="col-span-4">
          <Button btnColor="secondary">
            <i className="fas fa-hourglass-start pr-2"></i>
            <span>{balance.toFixed(2) || 0}</span>
            <span className="font-semibold text-xs ml-1 mt-1">{"DH"}</span>
          </Button>
        </Link>

        <Button
          className="col-span-4"
          icon="check"
          btnColor="primary"
          label={tl("will_pay")}
          disabled={!(balance > 0) || isSaving}
          onClick={markPaid}
        />
      </div>
    </Card>
  );
};
