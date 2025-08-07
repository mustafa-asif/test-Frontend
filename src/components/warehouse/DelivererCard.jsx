import { Copyable } from "../shared/Copyable";
import { HumanDate } from "../shared/HumanDate";
import { Card } from "../shared/Card";
import { useConfirmation, useQuickEditor } from "../shared/ToolsProvider";
import { Link } from "react-router-dom";
import { Pic } from "../shared/Pic";
import { Button, IconButton } from "../shared/Button";
import { xFetch } from "../../utils/constants";
import { cl, getMostRecentTimestamp } from "../../utils/misc";
import { useTranslation } from "../../i18n/provider";

export const DelivererCard = ({
  _id,
  timestamps,
  active,
  image,
  name,
  free_items = 0,
  reserved_items = 0,
  cycle,
}) => {
  const confirmAction = useConfirmation();
  const tl = useTranslation();
  const [isSaving, editDocument, deleteDocument, customEditDocument] = useQuickEditor(
    _id,
    "deliverers"
  );

  function markPaid() {
    if (!cycle?._id) return;
    const customFn = async () =>
      await xFetch(`/cycles/${cycle._id}`, {
        method: "PATCH",
        body: { status: "paid", total: cycle.total },
      });
    function successFn(cycle) {
      console.log(`updated cycle `, cycle);
    }
    return confirmAction({
      title: `Livreur Payé ${cycle?.total} DH`,
      onConfirm: () => customEditDocument(customFn, successFn),
    });
  }

  return (
    <Card loading={isSaving}>
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-full text-sm font-light text-gray-400 hover:text-green-500 flex items-center col-span-2 -mt-1">
          <Copyable text={_id} />
        </div>

        <div className="rounded-full text-sm font-light text-gray-400 flex items-center col-span-2 justify-end -mt-1">
          <HumanDate date={getMostRecentTimestamp(timestamps)} long />
        </div>

        <div className="col-span-4 flex justify-between">
          <div className="rounded-full h-10 text-sm font-semibold flex items-center">
            <Link
              to={{ pathname: "orders", state: { keyword: _id, status: "in progress" } }}
              className="flex items-center">
              <Pic
                //image={image}
                fallback="user"
                className="mr-1"
              />
              <span className="line-clamp-2">{name}</span>
              <i className={`fas fa-circle ml-2 ${active ? "text-green-500" : "text-red-500"}`}></i>
              <span className="ml-1 h-6 min-w-6 px-1 rounded-full bg-green-50 text-green-500 border border-solid border-green-100 flex items-center justify-center">
                {free_items}
              </span>
              <span className="ml-1 h-6 min-w-6 px-1 rounded-full bg-yellow-50 text-yellow-500 border border-solid border-yellow-100 flex items-center justify-center">
                {reserved_items}
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-x-[5px]">
            <Link to={`/scan?deliverer_id=${_id}`} className="min-w-[40px]">
              <Button btnColor="secondary" icon="qrcode" className="h-10" />
            </Link>
            <Link to={`/deliverers/${_id}/edit`} className="min-w-[40px]">
              <Button btnColor="gray" icon="pen" className="h-10" />
            </Link>
          </div>
        </div>

        {/*  */}

        <Link
          to={cycle?._id ? `/cycles/${cycle?._id}/payments` : "/deliverers"}
          className="col-span-4">
          <Button btnColor="secondary">
            <i className="fas fa-hourglass-start pr-2"></i>
            <span>{cycle?.total?.toFixed(2) || 0}</span>
            <span className="font-semibold text-xs ml-1 mt-1">{"DH"}</span>
          </Button>
        </Link>

        <Button
          className="col-span-4"
          icon="check"
          btnColor="primary"
          label={tl("will_receive")}
          disabled={!(cycle?.total > 0) || isSaving}
          onClick={markPaid}
        />
      </div>
    </Card>
  );
};
