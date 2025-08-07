export const model_status_role = {
  // in example_model, example_status can be set when role is role and current status is among example_options
  example_model: {
    example_status: {
      example_role: ["example_options"],
    },
  },
  // //
  orders: {
    "draft": {
      client: ["awaiting pickup", "awaiting transfer", "pending", "problem"],
      followup: [
        "awaiting pickup",
        "awaiting transfer",
        "pending",
        "problem",
        "cancelled",
        "refused",
        "deleted",
      ],
    },
    "pending": {
      client: ["draft"],
      followup: ["draft", "problem", "awaiting pickup"],
      deliverer: ["in progress"],
      warehouse: ["in progress", "problem", "awaiting pickup"],
    },
    "in progress": {
      followup: ["fulfilled"],
      deliverer: ["pending", "problem"],
    },
    "fulfilled": {
      deliverer: ["in progress"],
    },
    "problem": {
      followup: ["pending", "problem"],
      warehouse: ["pending"],
      deliverer: ["pending", "in progress"],
    },
    "cancelled": {
      followup: ["draft", "awaiting pickup", "awaiting transfer", "pending", "problem"],
      warehouse: ["awaiting pickup", "pending", "problem"],
      deliverer: ["pending", "in progress", "problem"],
    },
    "refused": {
      deliverer: ["in progress"],
    },
    "remove": {
      client: ["draft", "awaiting pickup", "awaiting transfer", "pending", "problem", "cancelled"],
    },
  },
  //
  pickups: {
    "remove": {
      client: ["cancelled", "pending", "problem"],
    },
    "pending": {
      followup: ["problem"],
      deliverer: ["in progress", "fulfilling"],
      warehouse: ["problem", "in progress"],
    },
    "problem": {
      warehouse: ["pending"],
      deliverer: ["pending"],
    },
    "cancelled": {
      followup: ["pending", "problem"],
      deliverer: ["pending", "problem"],
      warehouse: ["pending", "in progress", "problem"],
    },
    "in progress": {
      deliverer: ["pending", "problem"],
    },
    "fulfilled": {
      warehouse: ["in progress", "fulfilling"],
    },
  },
  //
  transfers: {
    pending: {
      warehouse: ["in progress"],
    },
    fulfilled: {
      followup: ["in progress"],
    },
    cancelled: {
      warehouse: ["pending"],
    },
    remove: {
      client: ["cancelled", "pending"],
    },
  },
  tickets: {
    closed: {
      followup: ["opened"],
    },
    opened: {
      followup: ["closed", "urgent", "stalled"],
    },
    stalled: {
      followup: ["closed", "urgent", "opened"],
    },
    urgent: {
      followup: ["closed", "stalled", "opened"],
    },
  },
};

export function getMenuDataFromMSR(model, status, role) {
  const options = [];

  const modelData = model_status_role[model];
  if (!modelData) return [];

  for (const [statusOption, roleStatus] of Object.entries(modelData)) {
    const isViable = roleStatus?.[role]?.includes(status);
    if (isViable) options.push(statusOption);
  }

  return options;
}
