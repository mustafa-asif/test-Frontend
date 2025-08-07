import { action } from "easy-peasy";
import { addIfNotPresent } from "../../utils/misc";
import lodash from "lodash";

export const shippersModel = {
  inited: false,
  loading: true,
  shippers: [],
  setInited: action((state, payload = true) => {
    state.inited = payload;
  }),
  addShipper: action((state, payload) => {
    state.shippers = addIfNotPresent(state.shippers, payload);
  }),
  addShippers: action((state, payload) => {
    state.inited = true;
    state.loading = false;
    state.shippers = addIfNotPresent(state.shippers, payload);
  }),
  updateShipper: action((state, payload) => {
    const {
      _id,
      updateDescription: { removedFields, updatedFields },
    } = payload;
    state.shippers = state.shippers.map((shipper) => {
      if (shipper._id !== _id) return shipper;

      for (let key of removedFields) {
        lodash.unset(shipper, key);
      }

      for (let key in updatedFields) {
        lodash.set(shipper, key, updatedFields[key]);
      }

      return shipper;
    });
  }),
  replaceShipper: action((state, payload) => {
    const { _id, data } = payload;
    state.shippers = state.shippers.map((shipper) => {
      if (shipper._id === _id) return { ...data, pinned: shipper.pinned };
      return shipper;
    });
  }),
  removeShipper: action((state, payload) => {
    state.shippers = state.shippers.filter((shipper) => shipper._id !== payload);
  }),
  setShippers: action((state, payload) => {
    for (const key in payload) {
      state[key] = payload[key];
    }
    if (typeof payload.loading === "undefined") state.loading = false;
    if (typeof payload.inited === "undefined") state.inited = true;
  }),
};
