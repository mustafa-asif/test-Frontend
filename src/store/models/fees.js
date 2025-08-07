import { action } from "easy-peasy";
import { addIfNotPresent } from "../../utils/misc";
import lodash from "lodash";

export const feesModel = {
  inited: false,
  loading: true,
  fees: [],
  listening: false,
  setListening: action((state, payload = true) => {
    state.listening = payload;
  }),
  setInited: action((state, payload = true) => {
    state.inited = payload;
  }),
  addFee: action((state, payload) => {
    state.fees = addIfNotPresent(state.fees, payload, true);
  }),
  addFees: action((state, payload) => {
    state.inited = true;
    state.loading = false;
    state.fees = addIfNotPresent(state.fees, payload);
  }),
  updateFee: action((state, payload) => {
    const {
      _id,
      updateDescription: { removedFields, updatedFields },
    } = payload;
    state.fees = state.fees.map((fee) => {
      if (fee._id !== _id) return fee;

      for (let key of removedFields) {
        lodash.unset(fee, key);
      }

      for (let key in updatedFields) {
        lodash.set(fee, key, updatedFields[key]);
      }

      return fee;
    });
  }),
  replaceFee: action((state, payload) => {
    const { _id, data } = payload;
    state.fees = state.fees.map((fee) => {
      if (fee._id === _id) return { ...data, pinned: fee.pinned };
      return fee;
    });
  }),
  removeFee: action((state, payload) => {
    state.fees = state.fees.filter((fee) => fee._id !== payload);
  }),
  setFees: action((state, payload) => {
    for (const key in payload) {
      state[key] = payload[key];
    }
    if (typeof payload.loading === "undefined") state.loading = false;
    if (typeof payload.inited === "undefined") state.inited = true;
  }),
};
