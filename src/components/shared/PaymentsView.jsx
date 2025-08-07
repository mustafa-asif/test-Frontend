import { useStoreState } from "easy-peasy";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../../i18n/provider";
import { Button } from "./Button";
import { useSeeDocument } from "./ToolsProvider";
import { DownloadXls } from "./DownloadXls";
import { DownloadCycleBtn } from "../client/DownloadCycleBtn";
import { cl } from "../../utils/misc";

export const PaymentsView = ({ cycle, ...props }) => {
  const tl = useTranslation();
  const total = cycle.total + cycle.pending;
  const authRole = useStoreState((state) => state.auth.user?.role);
  const orderIds = getOrderIds(cycle.payments);
  return (
    <Fragment>
      <div className="flex flex-col overflow-y-scroll rounded-md bg-white">
        <div className="flex flex-wrap items-center p-6">
          <div className="flex items-center ml-3 text-2xl mb-5">
            <span className="font-bold mr-3 capitalize">{tl("payment")}</span>
            <span className="text-lg">{cycle._id}</span>
          </div>
          <div className="flex w-full gap-x-[5px]">
            <div
              className={cl(
                "w-full h-12 rounded-full flex items-center justify-center bg-white border-2 text-xl cursor-default",
                { "border-yellow-500 text-yellow-500": cycle.status !== "paid" },
                { "border-green-500 text-green-500": cycle.status === "paid" }
              )}>
              <i
                className={`fas fa-${
                  cycle.status === "paid" ? "check" : "hourglass-start"
                } pr-2`}></i>
              <span>{total.toFixed(2)}</span>
              <span className="font-semibold text-xs ml-1 mt-1">DH</span>
            </div>
            <DownloadXls model="orders" filter={{ ids: orderIds }} />
            {authRole === "client" && orderIds.length > 0 && (
              <DownloadCycleBtn className="ml-1" cycle_id={cycle._id} />
            )}
          </div>
        </div>

        <table className="items-center w-full bg-transparent border-collapse">
          <thead className="thead-light">
            <tr>
              <th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-md uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                {tl("type")}
              </th>
              <th className="px-6 bg-green-50 text-green-500 align-middle border border-solid border-green-100 py-3 text-md uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
                {tl("amount")}
              </th>
            </tr>
          </thead>
          <tbody className="text-center">
            {groupPayments(cycle.payments).map(({ amount, ...group }) => (
              <TypeRow key={group.title} {...group} amount={amount.toFixed(2)} />
            ))}
          </tbody>
        </table>
      </div>
    </Fragment>
  );
};

export const GroupPaymentsView = ({ group, cycle }) => {
  const tl = useTranslation();
  const group_type = group.split("_")[1];
  const group_date = group.split("_")[0];

  const authRole = useStoreState((state) => state.auth.user?.role);
  const altType =
    group_type === "transfer" && authRole === "client"
      ? "returns"
      : group_type === "pickup" && authRole === "client"
      ? "pickups/packaging"
      : group_type + "s";

  const group_payments = cycle.payments.filter(
    (payment) => payment.type === group_type && fmtDate(payment.timestamps.created) === group_date
  );

  const group_total = group_payments.reduce((sum, payment) => {
    sum += payment.amount;
    return sum;
  }, 0);

  const columnName = group_type !== "other" ? "ID" : "Description";
  return (
    <Fragment>
      <div className="flex flex-col overflow-y-scroll rounded-md bg-white">
        <div className="flex flex-wrap items-center p-6">
          <div className="flex items-center ml-3 text-2xl mb-5">
            <span className="font-bold mr-3">
              {group_date} {tl(altType)}
            </span>
          </div>
          <Button btnColor={cycle.status === "paid" ? "green" : "yellow"}>
            <i
              className={`fas fa-${
                cycle.status === "paid" ? "check" : "hourglass-start"
              } pr-2`}></i>
            <span>{group_total.toFixed(2)}</span>
            <span className="font-semibold text-xs ml-1 mt-1">DH</span>
          </Button>
        </div>
      </div>
      <table className="items-center w-full bg-transparent border-collapse">
        <thead className="thead-light">
          <tr>
            <th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-md uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
              {columnName}
            </th>
            <th className="px-6 bg-green-50 text-green-500 align-middle border border-solid border-green-100 py-3 text-md uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
              {tl("amount")}
            </th>
          </tr>
        </thead>
        <tbody className="text-center">
          {combinePaymentIds(group_payments).map((combined) => (
            <TypeRow key={combined._id} {...combined} />
          ))}
        </tbody>
      </table>
    </Fragment>
  );
};

function TypeRow({ title, type, amount, hasPending, see, href, count }) {
  const tl = useTranslation();
  const seeDocument = useSeeDocument();
  const authRole = useStoreState((state) => state.auth.user?.role);
  const link = href?.startsWith("/") ? href : !!href ? `?group=${href}` : undefined;
  const date = title.split(" ")[0];
  const altType =
    type === "transfer" && authRole === "client"
      ? "returns"
      : type === "pickup" && authRole === "client"
      ? "pickups/packaging"
      : type + "s";
  return (
    <tr>
      <th className="border-t-0 px-6 border-l-0 border-r-0 text-xl whitespace-nowrap p-4 text-left align-middle">
        {see ? (
          <span className="cursor-pointer" onClick={() => seeDocument(see)}>
            {date.length === 10 ? date + " " + tl(altType) + " " : title + " "}
            {count && (
              <>
                (<span className={hasPending ? "text-yellow-400" : "text-green-400"}>{count}</span>)
              </>
            )}
            {hasPending && <i className="fas fa-hourglass-half text-yellow-400 ml-1 text-sm"></i>}
          </span>
        ) : link ? (
          <Link to={link}>
            {date.length === 10 ? date + " " + tl(altType) + " " : title + " "}
            {count && (
              <>
                (<span className={hasPending ? "text-yellow-400" : "text-green-400"}>{count}</span>)
              </>
            )}
            {hasPending && <i className="fas fa-hourglass-half text-yellow-400 ml-1 text-sm"></i>}
          </Link>
        ) : (
          <span>
            {title}{" "}
            {count && (
              <>
                (<span className={hasPending ? "text-yellow-400" : "text-green-400"}>{count}</span>)
              </>
            )}
            {hasPending && <i className="fas fa-hourglass-half text-yellow-400 ml-1 text-sm"></i>}
          </span>
        )}
      </th>
      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xl whitespace-nowrap p-4">
        {amount}
      </td>
    </tr>
  );
}

function groupPayments(payments) {
  const groups = {};

  for (const payment of payments) {
    const group_title = fmtDate(payment.timestamps.created) + " " + payment.type;

    groups[group_title] ??= {
      title: group_title,
      amount: 0,
      href:
        payment.type !== "sms" ? group_title.replace(/[/]/g, "-").replace(/\s/g, "_") : undefined,
      payments: [],
      count: 0,
      hasPending: false,
      type: payment.type,
    };

    groups[group_title].payments.push(payment);
    groups[group_title].amount += payment.amount;

    groups[group_title].hasPending ||= payment.status === "pending";

    if (groups[group_title].type === "warehousing") {
      groups[group_title].count = groups[group_title].payments.reduce((sum, payment) => {
        return sum + (payment.details?.items || 0);
      }, 0);
    } else if (groups[group_title].type === "other") {
      groups[group_title].count = groups[group_title].payments.length;
    } else {
      groups[group_title].count = countUniqueIds(groups[group_title].payments);
    }
  }

  return Object.values(groups).filter((group) => group.amount !== 0);
}

function fmtDate(d) {
  return new Date(d).toISOString().split("T")[0];
}

function getName(payment) {
  if (payment.type === "other") return payment.description;
  if (payment.type === "warehousing") {
    return `Stockage (${payment.details?.items || `..`} articles)`;
  } else return payment[payment.type]?._id;
}

function getLink(payment) {
  if (payment.type === "warehousing") return "";
  if (payment.type === "other") return "";
  else return `/view/${payment.type}s/${payment[payment.type]?._id}`;
}

function countUniqueIds(payments) {
  const unique = [...new Set([...payments.map((pay) => pay[pay.type]?._id)])];

  return unique.length;
}

function combinePaymentIds(payments) {
  const combined = [];
  for (const payment of payments) {
    const groupId = payment[payment.type]?._id;
    let index = combined.findIndex((comb) => comb.ids.includes(groupId));
    //
    if (!groupId || index === -1) {
      combined.push({
        _id: payment._id,
        title: getName(payment),
        hasPending: payment.status === "pending",
        amount: payment.amount,
        href: getLink(payment),
        ids: [groupId],
        see: ["order", "transfer", "pickup"].includes(payment.type)
          ? { model: payment.type + "s", _id: groupId }
          : null,
      });
      continue;
    }
    if (index !== -1) {
      const sign = payment.amount < 0 ? "-" : "+";
      combined[index].hasPending ||= payment.status === "pending";
      combined[index].ids.push(groupId);
      combined[index].amount += " " + sign + " " + Math.abs(payment.amount);
    }
    //
  }

  return combined.filter((comb) => comb.amount !== 0);
}

function getOrderIds(payments) {
  const ids = [];
  for (const payment of payments) {
    if (payment.type !== "order" || !payment.order?._id || ids.includes(payment.order?._id)) {
      continue;
    }
    ids.push(payment.order._id);
  }
  return ids;
}
