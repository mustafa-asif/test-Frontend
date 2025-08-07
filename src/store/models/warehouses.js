import { action } from "easy-peasy";
import { addIfNotPresent } from "../../utils/misc";
import lodash from "lodash";

export const warehousesModel = {
  inited: false,
  loading: true,
  warehouses: [],
  listening: false,
  setListening: action((state, payload = true) => {
    state.listening = payload;
  }),
  setInited: action((state, payload = true) => {
    state.inited = payload;
  }),
  addWarehouse: action((state, payload) => {
    state.warehouses = addIfNotPresent(state.warehouses, payload);
  }),
  addWarehouses: action((state, payload) => {
    state.inited = true;
    state.loading = false;
    state.warehouses = addIfNotPresent(state.warehouses, payload);
  }),
  updateWarehouse: action((state, payload) => {
    const {
      _id,
      updateDescription: { removedFields, updatedFields },
    } = payload;
    state.warehouses = state.warehouses.map((warehouse) => {
      if (warehouse._id !== _id) return warehouse;

      for (let key of removedFields) {
        lodash.unset(warehouse, key);
      }

      for (let key in updatedFields) {
        lodash.set(warehouse, key, updatedFields[key]);
      }

      return warehouse;
    });
  }),
  replaceWarehouse: action((state, payload) => {
    const { _id, data } = payload;
    state.warehouses = state.warehouses.map((warehouse) => {
      if (warehouse._id === _id) return { ...data, pinned: warehouse.pinned };
      return warehouse;
    });
  }),
  removeWarehouse: action((state, payload) => {
    state.warehouses = state.warehouses.filter((warehouse) => warehouse._id !== payload);
  }),
  setWarehouses: action((state, payload) => {
    for (const key in payload) {
      state[key] = payload[key];
    }
    if (typeof payload.loading === "undefined") state.loading = false;
    if (typeof payload.inited === "undefined") state.inited = true;
  }),
};
