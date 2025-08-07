import { action } from "easy-peasy";
import { addIfNotPresent } from "../../utils/misc";
import lodash from "lodash";

export const delivererToWarehouseCyclesModel = {
  inited: false,
  loading: true,
  delivererToWarehouseCycles: [],
  listening: false,
  setListening: action((state, payload = true) => {
    state.listening = payload;
  }),
  setInited: action((state, payload = true) => {
    state.inited = payload;
  }),
  addDelivererToWarehouseCycle: action((state, payload) => {
    state.delivererToWarehouseCycles = addIfNotPresent(state.delivererToWarehouseCycles, payload, true);
  }),
  addPayments: action((state, payload) => {
    const { payments, _id, prepend, override } = payload;
    state.delivererToWarehouseCycles = state.delivererToWarehouseCycles.map((cycle) => {
      if (cycle._id !== _id) return cycle;
      if (override) {
        cycle.payments = payments;
        return cycle;
      }

      cycle.payments = addIfNotPresent(cycle.payments, payments, prepend);
      return cycle;
    });
  }),
  addDelivererToWarehouseCycles: action((state, payload) => {
    state.inited = true;
    state.loading = false;
    state.delivererToWarehouseCycles = addIfNotPresent(state.delivererToWarehouseCycles, payload);
  }),
  updateDelivererToWarehouseCycle: action((state, payload) => {
    const {
      _id,
      updateDescription: { removedFields, updatedFields },
    } = payload;
    state.delivererToWarehouseCycles = state.delivererToWarehouseCycles.map((cycle) => {
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
  replaceDelivererToWarehouseCycle: action((state, payload) => {
    const { _id, data } = payload;
    state.delivererToWarehouseCycles = state.delivererToWarehouseCycles.map((cycle) => {
      if (cycle._id === _id) return { ...data };
      return cycle;
    });
  }),
  removeDelivererToWarehouseCycle: action((state, payload) => {
    state.delivererToWarehouseCycles = state.delivererToWarehouseCycles.filter((cycle) => cycle._id !== payload);
  }),
  setDelivererToWarehouseCycles: action((state, payload) => {
    for (const key in payload) {
      state[key] = payload[key];
    }
    if (typeof payload.loading === "undefined") state.loading = false;
    if (typeof payload.inited === "undefined") state.inited = true;
  }),
};
