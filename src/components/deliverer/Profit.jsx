import { useStoreState } from "easy-peasy";
import { Fragment } from "react";

export const Profit = ({ ...props }) => {
  const { cycles, loading } = useStoreState((state) => state.cycles);
  const currentCycle = cycles.find((cycle) => cycle.status === "active");
  const profit = calculateProfit(currentCycle);
  return (
    <div className="p-4 bg-white shadow-lg hover:shadow-xl transition duration-300 rounded-full z-10 text-2xl font-bold uppercase flex items-center justify-center h-12">
      <i className="fas fa-wallet pr-2 text-gray-500"></i>
      {loading ? (
        <div className="h-6 w-32 bg-gray-200 rounded-full animate-pulse"></div>
      ) : (
        <span className="text-green-500">{profit.toFixed(2)}</span>
      )}
      <span className="font-semibold text-xs ml-1 mt-1">{"DH"}</span>
    </div>
  );
};

function calculateProfit(cycle) {
  if (!cycle) return 0;
  const removedSum = cycle.payments.reduce((sum, payment) => {
    if (payment.amount < 0) sum += Math.abs(payment.amount);
    return sum;
  }, 0);
  return removedSum;
}
