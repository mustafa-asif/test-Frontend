import { cl } from "../../utils/misc";

export function OrderPaymentStatus({ payments_made }) {
  return (
    <div className="flex gap-x-[2px] col-span-4">
      <span
        className={cl(
          "h-6 min-w-6 px-[3px] text-sm rounded-full border border-solid flex items-center justify-center",
          { "text-yellow-500 border-yellow-100 bg-yellow-50": !payments_made },
          { "text-green-700 border-green-100 bg-green-50": payments_made }
        )}>
        {payments_made ? "Paiements Effectué" : "Paiements en attente"}
      </span>
    </div>
  );
}
