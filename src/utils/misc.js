import strings from "../i18n/strings";
import { IMG_POST_URL, STATS_URL, xFetch } from "./constants";
import lodash from "lodash";

export const xGetDashboard = async (filter) => {
  let queries = [];
  if (filter.from) {
    switch (filter.from) {
      case "today":
        queries.push(`from=${getDatePlusDays(getToday(), 0).toISOString()}`);
        break;
      case "last 3 days":
        queries.push(`from=${getDatePlusDays(getToday(), -3).toISOString()}`);
        break;
      case "last 7 days":
        queries.push(`from=${getDatePlusDays(getToday(), -7).toISOString()}`);
        break;
      case "last 30 days":
        queries.push(`from=${getDatePlusDays(getToday(), -30).toISOString()}`);
        break;
      default:
        const date = new Date(filter.from);
        // eslint-disable-next-line eqeqeq
        if (date != "Invalid Date") {
          queries.push(`from=${date.toISOString()}`);
        }
        break;
    }
  }

  if (filter.to) {
    const date = new Date(filter.to);
    // eslint-disable-next-line eqeqeq
    if (date != "Invalid Date") {
      queries.push(`to=${date.toISOString()}`);
    }
  }
  return xFetch("/statistics/dashboard", undefined, undefined, STATS_URL, queries);
};

export const getBgColor = (role) => {
  switch (role) {
    case "client":
      return "bg-green-500";
    case "warehouse":
      return "bg-yellow-500";
    case "deliverer":
      return "bg-green-500";
    case "followup":
      return "bg-gray-500";
    case "payman":
      return "bg-blue-500";
    case "commercial":
      return "bg-red-500";
    case "admin":
      return "bg-gray-700";
    default:
      return "bg-green-500";
  }
};

export function formatBankNumber(value) {
  if (!value) {
    return value;
  }
  const clearValue = value.replace(/\D+/g, "");
  const nextValue = `${clearValue.slice(0, 3)} ${clearValue.slice(3, 6)} ${clearValue.slice(
    6,
    22
  )} ${clearValue.slice(22, 24)}`;
  return nextValue.trim();
}

export const getOrderBg = (timeline) => {
  const times_interruped = timeline.reduce(
    (num, status) => (status.startsWith("problem") ? num + 1 : num),
    0
  );
  const isFulfilled = timeline.slice(-1)[0]?.startsWith("fulfilled");
  const isCancelled = timeline.slice(-1)[0]?.startsWith("cancelled");

  if (isFulfilled) return "bg-green-200";
  if (times_interruped === 1 && !isCancelled) return "bg-gray-200";
  if (times_interruped === 2 && !isCancelled) return "bg-yellow-200";
  if (times_interruped > 2 && !isCancelled) return "bg-red-200";
  return "bg-white";
};

// export const handleDuplicateData = (arr) => {
//   // return arr2.filter((doc, index) => {
//   //   // const duplicate =
//   // });
//   // filter duplicate and check __v
//   return arr;
// };
export const addIfNotPresent = (array, value, prepend = false) => {
  if (!Array.isArray(array)) {
    console.log(array);
    throw new Error("not an array");
  }
  switch (typeof value) {
    case "object": {
      const isArray = Array.isArray(value);
      if (!isArray) {
        const key = value._id ? "_id" : value.id ? "id" : undefined;
        if (!key) console.error(`checking object without _id or id key`, value);
        const isPresent = array.some((val) => val[key] === value[key]);
        if (isPresent) return array;

        return prepend ? [value, ...array] : [...array, value];
      }
      return value.reduce(
        (currentArray, currentVal) => addIfNotPresent(currentArray, currentVal, prepend),
        array
      );
    }
    default: {
      const isPresent = array.includes(value);
      if (isPresent) return array;
      return prepend ? [value, ...array] : [...array, value];
    }
  }
};

export const xUploadImage = async (image) => {
  const body = new FormData();
  body.append("image", image);
  return await xFetch("/media/image", { method: "POST", body }, true, IMG_POST_URL);
};

export const xUploadFile = async (file) => {
  const body = new FormData();
  body.append("file", file);
  return await xFetch("/media/file", { method: "POST", body }, true, IMG_POST_URL);
};

export const xUploadAudio = async (audioBlob) => {
  const file = new File([audioBlob], "audio.wav", { type: "audio/wav" });
  const body = new FormData();
  body.append("audio", file);
  return await xFetch("/media/audio", { method: "POST", body }, true, IMG_POST_URL);
};

export const prefixModel = {
  or: "orders",
  pi: "pickups",
  pr: "products",
  tr: "transfers",
  cl: "clients",
  cy: "cycles",
  pa: "payments",
  it: "items",
};

export const modelIcon = {
  or: "motorcycle",
  pi: "dolly",
  pr: "warehouse",
  tr: "truck",
  cl: "user-check",
  cy: "credit-card",
  pa: "receipt",
  it: "boxes",
};

const ID_LENGTHS = [8, 10, 12];

export const getIDModelName = (string) => {
  if (!ID_LENGTHS.includes(string?.length)) return undefined;
  return prefixModel[string.slice(0, 2)];
};

export const getDepsFromObjs = (object) => {
  if (typeof object !== "object") throw new Error("not an object");
  const deps = [];
  if (object.toISOString) {
    deps.push(object.toISOString());
    return deps;
  }
  for (const value of Object.values(object)) {
    if (typeof value === "object" && !!value) deps.push(...getDepsFromObjs(value));
    else if (typeof value !== "undefined") deps.push(value);
  }
  return deps;
};

// solution for deep nested options, changes like fees.warehouse.cities[n] include whole subobject.
export function getDifferences(oldObj, newObj) {
  let diff = {};
  for (let key of [...new Set([...Object.keys(oldObj ?? {}), ...Object.keys(newObj ?? {})])]) {
    switch (typeof newObj?.[key]) {
      case "boolean":
      case "number":
      case "string":
        if (!lodash.isEqual(oldObj?.[key], newObj?.[key])) {
          diff[key] = newObj?.[key];
        }
        break;
      case "object":
        if (Array.isArray(newObj?.[key])) {
          if (!lodash.isEqual(oldObj?.[key], newObj?.[key])) diff[key] = newObj[key];
          break;
        }
        if (typeof newObj?.[key]?.getTime === "function") {
          if (newObj[key].getTime() !== oldObj?.[key]?.getTime?.()) diff[key] = newObj[key];
          break;
        }
        let subdiff = getDifferences(oldObj?.[key], newObj?.[key]);
        if (Object.keys(subdiff).length > 0) diff[key] = subdiff;
        break;
      default:
        console.log(`unandled type: ${typeof newObj?.[key]}`);
        if (oldObj?.[key]) diff[key] = undefined;
        break;
    }
  }

  return diff;
}

export function getMostRecentTimestamp(timestamps) {
  if (!timestamps) return;
  let latest_timestamp = undefined;

  for (let key of Object.keys(timestamps)) {
    if (["last_client_message", "last_staff_message"].includes(key)) continue;
    const time = timestamps[key];
    latest_timestamp ??= new Date(time);
    if (new Date(time) > latest_timestamp) latest_timestamp = new Date(time);
  }

  return latest_timestamp;
}

export const minTimeFunc = (func, min_time) => {
  let time_elapsed = false;
  let function_ran = false;
  let func_return_value = undefined;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (function_ran) return resolve(func_return_value);
      else time_elapsed = true;
    }, min_time);
    func()
      .then((res) => {
        if (time_elapsed) return resolve(res);
        function_ran = true;
        func_return_value = res;
      })
      .catch((err) => reject(err));
  });
};

export function getDatePlusDays(date, additional_days) {
  return new Date(date.getTime() + 1000 * 60 * 60 * 24 * additional_days);
}

export function getToday() {
  return new Date(new Date().setHours(0, 0, 0, 0));
}

export function getTomorrow() {
  return new Date(new Date().setHours(0, 0, 0, 0) + 1000 * 60 * 60 * 24);
}

export const sortByAwaitingReply = (documents, user) => {
  return documents; // let backend do the work
  // const key = user.role !== "client" ? "last_client_message" : "last_staff_message";
  // return [...documents].sort((a, b) => {
  //   const a_time = a.timestamps[key];
  //   const b_time = b.timestamps[key];

  //   if (!a_time && !b_time) return 0;
  //   if (!a_time) return 1;
  //   if (!b_time) return -1;

  //   return (new Date(a_time)?.getTime() || 0) - (new Date(b_time)?.getTime() || 0);
  // });
};

export function formatDate(date, full = false) {
  date = new Date(date);
  let month = "" + (date.getMonth() + 1);
  let day = "" + date.getDate();

  if (day.length === 1) day = "0" + day;
  if (month.length === 1) month = "0" + month;

  const result = [day, month];
  if (full) {
    let year = "" + date.getFullYear();
    result.push(year);
  }
  return result.join("/");
}

export const cl = (...classNames) => {
  return classNames
    .map((className) => {
      if (typeof className === "undefined") return undefined;
      if (typeof className === "string") return className;

      const [key, condition] = Object.entries(className)[0];
      if (!condition) return undefined;

      return key;
    })
    .filter((val) => val)
    .join(" ");
};

export const pages_list = [
  "/dashboard",
  "/payments",
  "/fees",
  "/cities",
  "/warehouses",
  "/runs",
  "/snapshots",
  "/users",
  "/banners",
  "/dashboard",
  "/referrals",
  "/cycles",
  "/fetuses",
  "/clients",
  "/client-cycles",
  "/warehouse-cycles",
  "/orders",
  "/pickups",
  "/transfers",
  "/returns",
  "/deliverers",
  "/containers",
  "/invoices",
  "/products",
  "/account",
];

export const sort_map = {
  "-timestamps.updated": { label: "timestamps", detail: "new to old" },
  "timestamps.updated": { label: "timestamps", detail: "old to new" },
  "-timestamps.created": { label: "created", detail: "new to old" },
  "timestamps.created": { label: "created", detail: "old to new" },
  "-timestamps.last_client_message": { label: "client message", detail: "" },
  "timestamps.last_client_message": { label: "client message", detail: "awaiting reply first" },
  "-timestamps.last_staff_message": { label: "staff message", detail: "" },
  "timestamps.last_staff_message": { label: "staff message", detail: "awaiting reply first" },
  "deliverer": { label: "deliverer", detail: "no deliverer first" },
};

export function globalFilterToQuery(filter) {
  const query = [];

  if (filter.status && filter.status !== "all") {
    query.push(`status=${filter.status}`);
  }

  if (filter.keyword) {
    query.push(`keyword=${filter.keyword}`);
  }

  if (filter.date && filter.date !== "all time") {
    query.push(`date=${filter.date}`);
  }

  if (filter.dateType) {
    query.push(`date_type=${filter.dateType}`);
  }

  if (filter.from_date) {
    query.push(`from_date=${filter.from_date.getTime()}`);
  }
  if (filter.to_date) {
    query.push(`to_date=${filter.to_date.getTime()}`);
  }

  if (filter.deliverer && filter.deliverer !== "all") {
    query.push(`deliverer=${filter.deliverer}`);
  }

  if (filter.warehouse && filter.warehouse !== "all") {
    query.push(`warehouse=${filter.warehouse}`);
  }

  if (filter.tags && filter.tags !== "all") {
    query.push(`tags=${filter.tags}`);
  }

  if (filter.action && filter.action !== "all") {
    query.push(`action=${filter.action}`);
  }

  if (filter.thumbs && filter.thumbs !== "all") {
    query.push(`thumbs=${filter.thumbs}`);
  }

  if (filter.orderRating && filter.orderRating !== "all") {
    query.push(`orderRating=${filter.orderRating}`);
  }

  if (filter.pickupRating && filter.pickupRating !== "all") {
    query.push(`pickupRating=${filter.pickupRating}`);
  }

  if (filter.supportRating && filter.supportRating !== "all") {
    query.push(`supportRating=${filter.supportRating}`);
  }

  if (filter.supportCategory && filter.supportCategory !== "all") {
    query.push(`supportCategory=${filter.supportCategory}`);
  }

  if (filter.supportSubCategory && filter.supportSubCategory !== "all") {
    query.push(`supportSubCategory=${filter.supportSubCategory}`);
  }

  if (filter.productStatus && filter.productStatus !== "all") {
    query.push(`productStatus=${filter.productStatus}`);
  }

  if (filter.warehouseUser && filter.warehouseUser !== "all") {
    query.push(`warehouseUser=${filter.warehouseUser}`);
  }

  if (filter.inventoryScan && filter.inventoryScan !== "all") {
    query.push(`inventoryScan=${filter.inventoryScan}`);
  }

  if (filter.orderIssue && filter.orderIssue !== "all") {
    query.push(`orderIssue=${filter.orderIssue}`);
  }

  if (filter.needToReturn && filter.needToReturn !== "all") {
    query.push(`needToReturn=${filter.needToReturn}`);
  }

  if (filter.direction && filter.direction !== "all") {
    if (filter.direction === "incoming") {
      query.push(`to_warehouse._id=self`);
    }

    if (filter.direction === "outgoing") {
      query.push(`from_warehouse._id=self`);
    }
  }

  if (filter.transferType && filter.transferType !== "all") {
    if (filter.transferType === "lock") {
      query.push(`products.refr=exists`);
    } else if (filter.transferType === "stock") {
      query.push(`products.refr=not_exists`);
    }
  }

  if (filter.ids && Array.isArray(filter.ids) && filter.ids.length !== 0) {
    query.push(`ids=${filter.ids.join(",")}`);
  }

  if (filter.show_deliverer_payments) {
    query.push(`show_deliverer_payments=${filter.show_deliverer_payments}`);
  }

  if (filter.deliverer_status && filter.deliverer_status !== "all") {
    query.push(`status=${filter.deliverer_status}`);
  }

  return query;
}

export function currencyFormatter(val = 0) {
  if (val < 0) return val;

  return new Intl.NumberFormat("en-US", {}).format(val);
}

export function fmtDate(date) {
  return dateToMonth(date).slice(0, 3) + ". " + new Date(date).getDate();
}

export function fmtTimestamp(date) {
  return fmtDate(date) + ", " + new Date(date).toLocaleTimeString();
}

export function dateToMonth(date) {
  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  const index = new Date(date).getMonth();

  return monthNames[index];
}

export function getStatKeyColor(stat_key) {
  switch (stat_key) {
    case "pending_orders":
      return "#f97316";
    case "in_progress_orders":
      return "#86efac";
    case "awaiting_pickup_orders":
      return "#fed7aa";
    case "awaiting_transfer_orders":
      return "#fb923c";
    case "fulfilled_orders":
      return "#65a30d";
    case "problem_orders":
      return "#374151";
    case "draft_orders":
      return "#d1d5db";
    case "cancelled_orders":
      return "#ef4444";
    case "refused_orders":
      return "#fca5a5";
    default:
      return "#000000";
  }
}

export function getRandomString(length = 5) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export const RatingIconsLables = {
  VERY_DISSATISFIED: "Very Dissatisfied",
  DISSATISFIED: "Dissatisfied",
  NEUTRAL: "Neutral",
  SATISFIED: "Satisfied",
  VERY_SATISFIED: "Very Satisfied",
};

const model_status_translation = {
  orders: {
    "draft": "demande de suivi",
    "pending": "recu par livreur",
    "in progress": "en route",
    "fulfilled": "livré",
    "problem": "pas de reponse",
    "cancelled": "annule",
  },
  pickups: {
    "pending": "en attente",
    "problem": "pas de reponse",
    "in progress": "en route",
    "fulfilling": "en route",
    "fulfilled": "completé",
  },
  transfers: {
    "pending": "en attente",
    "in progress": "en route",
    "fulfilled": "completé",
  },
  purges: {
    "pending": "en attente",
    "in progress": "en route",
    "fulfilled": "completé",
  },
  containers: {
    pending: "en attente",
    sent: "envoyé",
  },
  cycles: {
    sent: "sent",
  },
  warehouseCycles: {
    "sent": "sent",
    "paid-justified": "payé (justifié)",
    "paid-unjustified": "payé (non justifié)",
    "paid-all": "tout payé",
  },
  clientCycles: {
    "active-ready": "active (à payer)",
    "active-low": "active (solde bas)",
    "active-all": "tout actif",
  },
  tickets: {
    urgent: "urgent aujourd'hui ",
    opened: "en cours ",
    stalled: "prévu",
    closed: "termine",
  },
};

export function translateStatus(model, status) {
  if (
    [
      "all",
      "pinned",
      "deleted",
      "active",
      "inactive",
      "not verified",
      "unassigned",
      "assigned",
    ].includes(status)
  )
    return strings["fr"][status];
  const translation = model_status_translation[model]?.[status];
  return translation || strings["fr"][status] || status;
}
