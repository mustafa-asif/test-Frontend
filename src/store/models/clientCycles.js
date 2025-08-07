import { action } from "easy-peasy";
import { addIfNotPresent } from "../../utils/misc";
import lodash from "lodash";

export const clientCyclesModel = {
  inited: false,
  loading: true,
  clientCycles: [],
  listening: false,
  setListening: action((state, payload = true) => {
    state.listening = payload;
  }),
  setInited: action((state, payload = true) => {
    state.inited = payload;
  }),
  addClientCycle: action((state, payload) => {
    state.clientCycles = addIfNotPresent(state.clientCycles, payload);
  }),
  addPayments: action((state, payload) => {
    const { payments, _id, prepend, override } = payload;
    state.clientCycles = state.clientCycles.map((cycle) => {
      if (cycle._id !== _id) return cycle;
      if (override) {
        cycle.payments = payments;
        return cycle;
      }

      cycle.payments = addIfNotPresent(cycle.payments, payments, prepend);

      return cycle;
    });
  }),
  addClientCycles: action((state, payload) => {
    state.inited = true;
    state.loading = false;
    state.clientCycles = addIfNotPresent(state.clientCycles, payload);
  }),
  updateClientCycle: action((state, payload) => {
    const {
      _id,
      updateDescription: { removedFields, updatedFields },
    } = payload;
    state.clientCycles = state.clientCycles.map((cycle) => {
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
  replaceClientCycle: action((state, payload) => {
    const { _id, data } = payload;
    state.clientCycles = state.clientCycles.map((cycle) => {
      if (cycle._id === _id) return { ...data };
      return cycle;
    });
  }),
  removeClientCycle: action((state, payload) => {
    state.clientCycles = state.clientCycles.filter((cycle) => cycle._id !== payload);
  }),
  setClientCycles: action((state, payload) => {
    for (const key in payload) {
      state[key] = payload[key];
    }
    if (typeof payload.loading === "undefined") state.loading = false;
    if (typeof payload.inited === "undefined") state.inited = true;
  }),
};
