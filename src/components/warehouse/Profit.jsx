import { useStoreState } from "easy-peasy";
import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { useConfirmation } from "../shared/ToolsProvider";
import { useTranslation } from "../../i18n/provider";
import { xFetch } from "../../utils/constants";
import { Button } from "../shared/Button";

export const Profit = ({ ...props }) => {
  const showToast = useToast();
  const confirmAction = useConfirmation();
  const tl = useTranslation();
  const [isLoading, setLoading] = useState(false);
  const { cycles, loading } = useStoreState((state) => state.cycles);
  const cyclesToAdmin = cycles.filter(
    (cycle) => cycle.status === "active" && cycle.to.account === "admin" && cycle.total > 0
  );
  const cycleToAdmin = cyclesToAdmin[cyclesToAdmin.length];

  const profit = calculateProfit(cyclesToAdmin);

  async function handlePaymentMade(_, cycle_id, cycle_total) {
    if (loading || isLoading || !cycle_id) return;
    setLoading(true);
    const { error } = await xFetch(`/cycles/${cycle_id}`, {
      method: "PATCH",
      body: { status: "sent", total: cycle_total },
    });
    setLoading(false);
    if (error) return showToast(error, "error");
    showToast("success", "success");
  }
  return (
    <Fragment>
      <div className=" p-4 bg-white shadow-lg hover:shadow-xl transition duration-300 rounded-md z-10 text-lg">
        Versement sur le compte<span className="font-bold px-1">LIVOMA</span>
        dont le RIBn° <span className="font-bold block">230 780 3978324221004300 60</span>
        Ouvert chez<span className="font-bold px-1">CIH</span>
      </div>

      {cyclesToAdmin.map((cycle) => (
        <div className="flex flex-col gap-y-3" key={cycle._id}>
          <Link to={`/cycles/${cycle._id}/payments`}>
            <Button btnColor="gray" className="flex justify-center items-center py-2.5">
              <i className="fas fa-hourglass pr-2"></i>
              {loading ? (
                <div className="h-6 w-32 bg-gray-200 rounded-full animate-pulse"></div>
              ) : (
                <span>{(cycle?.total || 0).toFixed(2)}</span>
              )}
              <span className="font-semibold text-xs ml-1 mt-1">DH</span>
            </Button>
          </Link>
          <Button
            label={tl("will_pay")}
            className="py-2.5 h-max px-3"
            icon="check"
            btnColor="primary"
            disabled={loading || !(cycle?.total > 0)}
            isLoading={isLoading}
            onClick={() =>
              confirmAction({
                title: "Voulez-vous payer maintenant?",
                onConfirm: () => handlePaymentMade(null, cycle._id, cycle.total),
              })
            }
          />
        </div>
      ))}
      <div
        className={` ${
          cyclesToAdmin.length % 2 === 0 ? "col-span-1" : "col-span-2"
        } p-4 bg-white shadow-lg hover:shadow-xl transition duration-300 rounded-full z-10 text-2xl font-bold uppercase flex items-center justify-center h-12`}>
        <i className="fas fa-wallet pr-2 text-gray-500"></i>
        {loading ? (
          <div className="h-6 w-32 bg-gray-200 rounded-full animate-pulse"></div>
        ) : (
          <span className="text-green-500">{profit.toFixed(2)}</span>
        )}
        <span className="font-semibold text-xs ml-1 mt-1">{"DH"}</span>
      </div>
    </Fragment>
  );
};

function calculateProfit(cycles) {
  if (!cycles?.length) return 0;
  let removedSum = 0;
  for (const cycle of cycles) {
    removedSum += cycle.payments.reduce((sum, payment) => {
      if (payment.amount < 0) sum += Math.abs(payment.amount);
      return sum;
    }, 0);
  }

  return removedSum;
}
