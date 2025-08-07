import { action } from "easy-peasy";
import { addIfNotPresent } from "../../utils/misc";
import lodash from "lodash";

export const tenantCyclesModel = {
  inited: false,
  loading: true,
  tenantCycles: [],
  listening: false,
  setListening: action((state, payload = true) => {
    state.listening = payload;
  }),
  setInited: action((state, payload = true) => {
    state.inited = payload;
  }),
  addTenantCycle: action((state, payload) => {
    state.tenantCycles = addIfNotPresent(state.tenantCycles, payload);
  }),
  addPayments: action((state, payload) => {
    const { payments, _id, prepend, override } = payload;
    state.tenantCycles = state.tenantCycles.map((cycle) => {
      if (cycle._id !== _id) return cycle;
      if (override) {
        cycle.payments = payments;
        return cycle;
      }

      cycle.payments = addIfNotPresent(cycle.payments, payments, prepend);

      return cycle;
    });
  }),
  addTenantCycles: action((state, payload) => {
    state.inited = true;
    state.loading = false;
    state.tenantCycles = addIfNotPresent(state.tenantCycles, payload);
  }),
  updateTenantCycle: action((state, payload) => {
    const {
      _id,
      updateDescription: { removedFields, updatedFields },
    } = payload;
    state.tenantCycles = state.tenantCycles.map((cycle) => {
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
  replaceTenantCycle: action((state, payload) => {
    const { _id, data } = payload;
    state.tenantCycles = state.tenantCycles.map((cycle) => {
      if (cycle._id === _id) return { ...data };
      return cycle;
    });
  }),
  removeTenantCycle: action((state, payload) => {
    state.tenantCycles = state.tenantCycles.filter((cycle) => cycle._id !== payload);
  }),
  setTenantCycles: action((state, payload) => {
    for (const key in payload) {
      state[key] = payload[key];
    }
    if (typeof payload.loading === "undefined") state.loading = false;
    if (typeof payload.inited === "undefined") state.inited = true;
  }),
};
