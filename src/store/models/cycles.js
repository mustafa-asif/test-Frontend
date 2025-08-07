import { action } from "easy-peasy";
import { addIfNotPresent } from "../../utils/misc";
import lodash from "lodash";

export const cyclesModel = {
  inited: false,
  loading: true,
  cycles: [],
  listening: false,
  setListening: action((state, payload = true) => {
    state.listening = payload;
  }),
  setInited: action((state, payload = true) => {
    state.inited = payload;
  }),
  addCycle: action((state, payload) => {
    state.cycles = addIfNotPresent(state.cycles, payload, true);
  }),
  addPayments: action((state, payload) => {
    const { payments, _id, prepend, override } = payload;
    state.cycles = state.cycles.map((cycle) => {
      if (cycle._id !== _id) return cycle;
      if (override) {
        cycle.payments = payments;
        return cycle;
      }

      cycle.payments = addIfNotPresent(cycle.payments, payments, prepend);
      return cycle;
    });
  }),
  addCycles: action((state, payload) => {
    state.inited = true;
    state.loading = false;
    state.cycles = addIfNotPresent(state.cycles, payload);
  }),
  updateCycle: action((state, payload) => {
    const {
      _id,
      updateDescription: { removedFields, updatedFields },
    } = payload;
    state.cycles = state.cycles.map((cycle) => {
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
  replaceCycle: action((state, payload) => {
    const { _id, data } = payload;
    state.cycles = state.cycles.map((cycle) => {
      if (cycle._id === _id) return { ...data };
      return cycle;
    });
  }),
  removeCycle: action((state, payload) => {
    state.cycles = state.cycles.filter((cycle) => cycle._id !== payload);
  }),
  setCycles: action((state, payload) => {
    for (const key in payload) {
      state[key] = payload[key];
    }
    if (typeof payload.loading === "undefined") state.loading = false;
    if (typeof payload.inited === "undefined") state.inited = true;
  }),
};
