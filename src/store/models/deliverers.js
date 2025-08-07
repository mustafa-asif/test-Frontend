import { action } from "easy-peasy";
import { addIfNotPresent } from "../../utils/misc";
import lodash from "lodash";

export const deliverersModel = {
  inited: false,
  loading: true,
  deliverers: [],
  listening: false,
  setListening: action((state, payload = true) => {
    state.listening = payload;
  }),
  setInited: action((state, payload = true) => {
    state.inited = payload;
  }),
  addDeliverer: action((state, payload) => {
    state.deliverers = addIfNotPresent(state.deliverers, payload, true);
  }),
  addDeliverers: action((state, payload) => {
    state.inited = true;
    state.loading = false;
    state.deliverers = addIfNotPresent(state.deliverers, payload);
  }),
  updateDeliverer: action((state, payload) => {
    const {
      _id,
      updateDescription: { removedFields, updatedFields },
    } = payload;
    state.deliverers = state.deliverers.map((deliverer) => {
      if (deliverer._id !== _id) return deliverer;

      for (let key of removedFields) {
        lodash.unset(deliverer, key);
      }

      for (let key in updatedFields) {
        lodash.set(deliverer, key, updatedFields[key]);
      }

      return deliverer;
    });
  }),
  replaceDeliverer: action((state, payload) => {
    const { _id, data } = payload;
    state.deliverers = state.deliverers.map((deliverer) => {
      if (deliverer._id === _id) return { ...data, pinned: deliverer.pinned };
      return deliverer;
    });
  }),
  removeDeliverer: action((state, payload) => {
    state.deliverers = state.deliverers.filter((deliverer) => deliverer._id !== payload);
  }),
  setDeliverers: action((state, payload) => {
    for (const key in payload) {
      state[key] = payload[key];
    }
    if (typeof payload.loading === "undefined") state.loading = false;
    if (typeof payload.inited === "undefined") state.inited = true;
  }),
};
