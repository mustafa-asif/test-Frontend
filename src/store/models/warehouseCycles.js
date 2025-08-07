import { action } from "easy-peasy";
import { addIfNotPresent } from "../../utils/misc";
import lodash from "lodash";

export const warehouseCyclesModel = {
  inited: false,
  loading: true,
  warehouseCycles: [],
  listening: false,
  setListening: action((state, payload = true) => {
    state.listening = payload;
  }),
  setInited: action((state, payload = true) => {
    state.inited = payload;
  }),
  addWarehouseCycle: action((state, payload) => {
    state.warehouseCycles = addIfNotPresent(state.warehouseCycles, payload, true);
  }),
  addPayments: action((state, payload) => {
    const { payments, _id, prepend, override } = payload;
    state.warehouseCycles = state.warehouseCycles.map((cycle) => {
      if (cycle._id !== _id) return cycle;
      if (override) {
        cycle.payments = payments;
        return cycle;
      }

      cycle.payments = addIfNotPresent(cycle.payments, payments, prepend);

      return cycle;
    });
  }),
  addWarehouseCycles: action((state, payload) => {
    state.inited = true;
    state.loading = false;
    state.warehouseCycles = addIfNotPresent(state.warehouseCycles, payload);
  }),
  updateWarehouseCycle: action((state, payload) => {
    const {
      _id,
      updateDescription: { removedFields, updatedFields },
    } = payload;
    state.warehouseCycles = state.warehouseCycles.map((cycle) => {
      if (cycle._id !== _id) return cycle;

      for (let key of removedFields) {
        lodash.unset(cycle, key);
      }

      for (let key in updatedFields) {
        lodash.set(cycle, key, updatedFields[key]);
      }

      return cycle;
    });
  }),
  replaceWarehouseCycle: action((state, payload) => {
    const { _id, data } = payload;
    state.warehouseCycles = state.warehouseCycles.map((cycle) => {
      if (cycle._id === _id) return { ...data };
      return cycle;
    });
  }),
  removeWarehouseCycle: action((state, payload) => {
    state.warehouseCycles = state.warehouseCycles.filter((cycle) => cycle._id !== payload);
  }),
  setWarehouseCycles: action((state, payload) => {
    for (const key in payload) {
      state[key] = payload[key];
    }
    if (typeof payload.loading === "undefined") state.loading = false;
    if (typeof payload.inited === "undefined") state.inited = true;
  }),
};
