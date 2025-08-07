import { useStoreActions, useStoreState } from "easy-peasy";
import { Link } from "react-router-dom";
import useFirstVisit from "../../hooks/useFirstVisit";
import { useToast } from "../../hooks/useToast";
import { useTranslation } from "../../i18n/provider";
import { fmtDate, xFetch } from "../../utils/constants";
import { formatDate } from "../../utils/misc";
import { LargeTableSkeleton } from "../skeletons/LargeTableSkeleton";

export const ReferralsCard = () => {
  const tl = useTranslation();
  const { loading, referrals } = useStoreState((state) => state.referrals);
  if (loading) return <LargeTableSkeleton />;
  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-xl">
      <div className="block w-full overflow-x-auto">
        <table className="items-center w-full bg-transparent border-collapse">
          <thead>
            <tr>
              <th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-md uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold">
                {tl("registration_date")}
              </th>
              <th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-md uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold">
                {tl("client_id")}
              </th>
              <th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-md uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold">
                {tl("orders")}
              </th>
              <th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-md uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold">
                {tl("earning")}
              </th>
            </tr>
          </thead>
          <tbody className="text-center">
            {referrals.map((ref) => (
              <ClientRow key={ref.client._id} {...ref} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function ClientRow({ client, total_earned, fulfilled_orders }) {
  return (
    <tr>
      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xl whitespace-nowrap p-4">
        {formatDate(client.date_created, true)}
      </td>
      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xl whitespace-nowrap p-4">
        {client._id}
      </td>
      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xl whitespace-nowrap p-4">
        {fulfilled_orders}
      </td>
      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xl whitespace-nowrap p-4">
        {total_earned} <span className="text-xs">dh</span>
      </td>
    </tr>
  );
}
