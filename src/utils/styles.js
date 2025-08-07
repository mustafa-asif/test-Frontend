const TYPES = {
  orders: {
    "all": { icon: "fa-th-large" },
    "pinned": {
      icon: "fa-thumbtack",
      color1: "red-300",
      color2: "red-400",
    },
    "refused": {
      icon: "fa-ban",
      color1: "red-300",
      color2: "red-400",
    },
    "postponed": {
      icon: "fa-clock",
      color1: "purple-300",
      color2: "purple-400",
    },
    "draft": { icon: "fa-pen", color1: "gray-700", color2: "gray-800" },
    "problem": { icon: "fa-exclamation", color1: "gray-700", color2: "gray-800" },
    "awaiting pickup": {
      icon: "fa-dolly",
      color1: "red-400",
      color2: "red-500",
    },
    "awaiting transfer": {
      icon: "fa-truck",
      color1: "yellow-500",
      color2: "yellow-600",
    },
    "pending": {
      icon: "fa-motorcycle",
      color1: "yellow-500",
      color2: "yellow-600",
    },
    "in progress": {
      icon: "fa-motorcycle",
      color1: "green-500",
      color2: "green-600",
    },
    "fulfilled": { icon: "fa-check", color1: "green-500", color2: "green-600" },
    "returned-changed": { icon: "fa-motorcyle", color1: "gray-700", color2: "gray-800" },
    "returned-fully": { icon: "fa-undo", color1: "red-400", color2: "red-500" },
    "returned-warehouse": { icon: "fa-undo", color1: "yellow-300", color2: "yellow-400" },
    "returned-started": { icon: "fa-undo", color1: "yellow-300", color2: "yellow-400" },
    "returned-pending": { icon: "fa-undo", color1: "yellow-500", color2: "yellow-600" },
    "cancelled": { icon: "fa-times", color1: "red-500", color2: "red-600" },
    "deleted": { icon: "fa-trash", color1: "red-700", color2: "red-800" },
  },
  pickups: {
    "all": { icon: "fa-th-large" },
    "postponed": {
      icon: "fa-clock",
      color1: "purple-300",
      color2: "purple-400",
    },
    "problem": { icon: "fa-exclamation", color1: "gray-700", color2: "gray-800" },
    "pending": {
      icon: "fa-dolly",
      color1: "yellow-500",
      color2: "yellow-600",
    },
    "in progress": {
      icon: "fa-dolly",
      color1: "green-500",
      color2: "green-600",
    },
    "fulfilling": {
      icon: "fa-motorcycle",
      color1: "green-500",
      color2: "green-600",
    },
    "fulfilled": { icon: "fa-check", color1: "green-500", color2: "green-600" },
    "cancelled": { icon: "fa-times", color1: "red-500", color2: "red-600" },
    "deleted": { icon: "fa-trash", color1: "red-700", color2: "red-800" },
  },
  transfers: {
    "pinned": {
      icon: "fa-thumbtack",
      color1: "red-300",
      color2: "red-400",
    },
    "all": { icon: "fa-th-large" },
    "pending": {
      icon: "fa-truck",
      color1: "yellow-500",
      color2: "yellow-600",
    },
    "in progress": {
      icon: "fa-truck",
      color1: "green-500",
      color2: "green-600",
    },
    "fulfilled": { icon: "fa-check", color1: "green-500", color2: "green-600" },
    "cancelled": { icon: "fa-times", color1: "red-500", color2: "red-600" },
    "deleted": { icon: "fa-trash", color1: "red-700", color2: "red-800" },
  },
  containers: {
    all: { icon: "fa-th-large" },
    arrived: {
      icon: "fa-box",
      color1: "green-500",
      color2: "green-600",
    },
    pending: {
      icon: "fa-box-open",
      color1: "yellow-500",
      color2: "yellow-600",
    },
    sent: {
      icon: "fa-truck",
      color1: "green-500",
      color2: "green-600",
    },
    resolved: { icon: "fa-check", color1: "green-500", color2: "green-600" },
    "resolved with problems": { icon: "fa-check", color1: "green-500", color2: "green-600" },
    discarded: { icon: "fa-times", color1: "red-500", color2: "red-600" },
    pinned: {
      icon: "fa-thumbtack",
      color1: "red-300",
      color2: "red-400",
    },
  },
  returns: {
    "all": { icon: "fa-th-large" },
    "pending": {
      icon: "fa-motorcycle",
      color1: "yellow-500",
      color2: "yellow-600",
    },
    "in progress": {
      icon: "fa-motorcycle",
      color1: "green-500",
      color2: "green-600",
    },
    "fulfilled": { icon: "fa-check", color1: "green-500", color2: "green-600" },
    "cancelled": { icon: "fa-times", color1: "red-500", color2: "red-600" },
  },
  purges: {
    "all": { icon: "fa-reply" },
    "pending": {
      icon: "fa-motorcycle",
      color1: "yellow-500",
      color2: "yellow-600",
    },
    "in progress": {
      icon: "fa-motorcycle",
      color1: "green-500",
      color2: "green-600",
    },
    "fulfilled": { icon: "fa-reply", color1: "green-500", color2: "green-600" },
    "cancelled": { icon: "fa-times", color1: "red-500", color2: "red-600" },
  },
  deliverers: {
    all: { icon: "fa-th-large" },
    active: { icon: "fa-circle", color1: "green-500", color2: "green-600" },
    inactive: { icon: "fa-circle", color1: "red-500", color2: "red-600" },
  },
  warehouses: {
    all: { icon: "fa-th-large" },
    active: { icon: "fa-circle", color1: "green-500", color2: "green-600" },
    inactive: { icon: "fa-circle", color1: "red-500", color2: "red-600" },
  },
  _default: {
    icon: "fa-circle",
    color1: "gray-500",
    color2: "gray-600",
  },
  payments: {
    all: { icon: "fa-th-large" },
    draft: { icon: "fa-clock", color1: "yellow-500", color2: "yellow-600" },
    pending: { icon: "fa-clock", color1: "yellow-500", color2: "yellow-600" },
    cancelled: { icon: "fa-times", color1: "red-500", color2: "red-600" },
    fulfilled: { icon: "fa-check", color1: "green-500", color2: "green-600" },
  },
  invoices: {
    all: { icon: "fa-th-large" },
    draft: { icon: "fa-hourglass-half", color1: "yellow-500", color2: "yellow-600" },
    fulfilled: { icon: "fa-check", color1: "green-500", color2: "green-600" },
    cancelled: { icon: "fa-times", color1: "red-500", color2: "red-600" },
  },
  clients: {
    "all": { icon: "fa-th-large" },
    "active": { icon: "fa-circle", color1: "green-500", color2: "green-600" },
    "inactive": { icon: "fa-circle", color1: "red-500", color2: "red-600" },
    "not verified": {
      icon: "fa-circle",
      color1: "yellow-500",
      color2: "yellow-600",
    },
    "unassigned": { icon: "fa-circle", color1: "indigo-200", color2: "indigo-300" },
    "assigned": { icon: "fa-circle", color1: "indigo-500", color2: "indigo-600" },
  },
  cycles: {
    all: { icon: "fa-th-large" },
    sent: { icon: "fa-clock", color1: "yellow-500", color2: "yellow-600" },
    active: {
      icon: "fa-hourglass-half",
      color1: "yellow-500",
      color2: "yellow-600",
    },
    paid: { icon: "fa-check", color1: "green-500", color2: "green-600" },
  },
  warehouseCycles: {
    "all": { icon: "fa-th-large" },
    "sent": { icon: "fa-clock", color1: "yellow-500", color2: "yellow-600" },
    "active": {
      icon: "fa-hourglass-half",
      color1: "yellow-500",
      color2: "yellow-600",
    },
    "paid": { icon: "fa-check", color1: "green-500", color2: "green-600" },
    "paid-all": { icon: "fa-check", color1: "green-700", color2: "green-800" },
    "paid-justified": { icon: "fa-check-double", color1: "green-500", color2: "green-600" },
    "paid-unjustified": { icon: "fa-check", color1: "yellow-500", color2: "yellow-600" },
  },
  delivererToWarehouseCycles: {
    "all": { icon: "fa-th-large" },
    "sent": { icon: "fa-clock", color1: "yellow-500", color2: "yellow-600" },
    "active": {
      icon: "fa-hourglass-half",
      color1: "yellow-500",
      color2: "yellow-600",
    },
    "paid": { icon: "fa-check", color1: "green-500", color2: "green-600" },
    "paid-all": { icon: "fa-check", color1: "green-700", color2: "green-800" },
    "paid-justified": { icon: "fa-check-double", color1: "green-500", color2: "green-600" },
    "paid-unjustified": { icon: "fa-check", color1: "yellow-500", color2: "yellow-600" },
  },
  clientCycles: {
    "all": { icon: "fa-th-large" },
    "active": {
      icon: "fa-hourglass-half",
      color1: "yellow-500",
      color2: "yellow-600",
    },
    "paid": { icon: "fa-check", color1: "green-500", color2: "green-600" },
    "active-all": {
      icon: "fa-hourglass-half",
      color1: "yellow-700",
      color2: "yellow-800",
    },
    "active-low": {
      icon: "fa-hourglass-half",
      color1: "yellow-300",
      color2: "yellow-400",
    },
    "active-ready": {
      icon: "fa-hourglass",
      color1: "green-300",
      color2: "green-400",
    },
  },
  tenantCycles: {
    all: { icon: "fa-th-large" },
    active: {
      icon: "fa-hourglass-half",
      color1: "yellow-500",
      color2: "yellow-600",
    },
    paid: { icon: "fa-check", color1: "green-500", color2: "green-600" },
  },
  items: {
    "awaiting pickup": { icon: "fa-dolly", color1: "gray-300", color2: "gray-300" },
    "undergoing pickup": { icon: "fa-dolly", color1: "yellow-500", color2: "yellow-500" },
    "undergoing transfer": { icon: "fa-truck", color1: "yellow-500", color2: "yellow-500" },
    "available": { icon: "fa-warehouse", color1: "green-500", color2: "green-500" },
    "with deliverer": { icon: "fa-motorcycle", color1: "yellow-500", color2: "yellow-500" },
    "returned": { icon: "fa-undo", color1: "red-500", color2: "red-500" },
    "delivered": { icon: "fa-check", color1: "green-500", color2: "green-500" },
  },
  direction: {
    all: { icon: "fa-circle", color1: "gray-500", color2: "gray-500" },
    incoming: { icon: "fa-arrow-down", color1: "blue-600", color2: "blue-600" },
    outgoing: { icon: "fa-arrow-up", color1: "pink-600", color2: "pink-600" },
  },
  tickets: {
    opened: { icon: "fa-question-circle", color1: "yellow-400", color2: "yellow-400" },
    closed: { icon: "fa-check-circle", color1: "gray-800", color2: "gray-800" },
    urgent: { icon: "fa-exclamation-circle", color1: "red-500", color2: "red-500" },
    stalled: { icon: "fa-pause-circle", color1: "yellow-700", color2: "yellow-700" },
  },
  thumbs: {
    all: { icon: "fas fa-th-large" },
    up: { icon: "fas fa-thumbs-up", color1: "green-500" },
    down: { icon: "fas fa-thumbs-down", color1: "red-500" },
  },
  rating: {
    "all": { icon: "fas fa-th-large" },
    "Very Dissatisfied": { icon: "😞", color1: "red-500" },
    "Dissatisfied": { icon: "😟", color1: "red-500" },
    "Neutral": { icon: "😐", color1: "yellow-500" },
    "Satisfied": { icon: "😊", color1: "green-400" },
    "Very Satisfied": { icon: "😁", color1: "green-500" },
  },
};

export const getIconConf = (type, status) => {
  return TYPES[type]?.[status]?.icon || TYPES._default.icon;
};

export const getColorConf = (type, status, num) => {
  return TYPES[type]?.[status]?.[`color${num || "1"}`] || TYPES._default[`color${num || "1"}`];
};

export default TYPES;
