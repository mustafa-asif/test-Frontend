import { useTranslation } from "../../i18n/provider";
import { cl } from "../../utils/misc";

export function TrackedItems({ tracked_items }) {
  const tl = useTranslation();
  if (!tracked_items || tracked_items.length === 0) return <></>;

  const statuses = tracked_items.reduce((obj, curr) => {
    const itemStatus = getTrackedItemStatus(curr);
    if (itemStatus === "-") return obj; // ignore
    obj[itemStatus] ??= 0;
    obj[itemStatus] += 1;
    return obj;
  }, {});

  if (Object.keys(statuses).length === 0) return <></>; // no data

  return (
    <div className="flex gap-x-[2px] col-span-4">
      {Object.keys(statuses).map((key) => (
        <span
          className={cl(
            "h-6 min-w-6 px-[3px] text-sm rounded-full border border-solid flex items-center justify-center",
            getStatusColor(key)
          )}>
          {statuses[key]} {tl(key)}
        </span>
      ))}
    </div>
  );
}

export function getTrackedItemStatus(tracked_item) {
  if (!!tracked_item.newOrder) {
    return "returned-changed";
  }
  if (tracked_item.status === "returned" && !tracked_item.newOrder) {
    return "returned-fully";
  }
  if (tracked_item.status === "available" && tracked_item.isHome && !tracked_item.newOrder) {
    return "returned-warehouse";
  }
  if (
    tracked_item.status === "undergoing transfer" &&
    !tracked_item.isHome &&
    !tracked_item.newOrder
  ) {
    return "returned-started";
  }
  if (tracked_item.status === "available" && !tracked_item.isHome && !tracked_item.newOrder) {
    return "returned-pending";
  }
  return "-";
}

function getStatusColor(status) {
  switch (status) {
    case "returned-changed":
      return "text-blue-800 border-blue-100 bg-blue-50";
    case "returned-fully":
      return "text-gray-800 border-gray-100 bg-gray-50";
    case "returned-warehouse":
      return "text-yellow-500 border-yellow-100 bg-yellow-50";
    case "returned-started":
      return "text-yellow-800 border-yellow-200 bg-yellow-100";
    case "returned-pending":
      return "text-red-500 border-red-100 bg-red-50";
    default:
      return "text-gray-500 border-gray-100 bg-gray-50";
  }
}
