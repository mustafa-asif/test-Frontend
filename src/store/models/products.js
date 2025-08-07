import { action } from "easy-peasy";
import { addIfNotPresent } from "../../utils/misc";
import lodash from "lodash";

export const productsModel = {
  inited: false,
  loading: true,
  products: [],
  listening: false,
  setListening: action((state, payload = true) => {
    state.listening = payload;
  }),
  setInited: action((state, payload = true) => {
    state.inited = payload;
  }),
  addProduct: action((state, payload) => {
    state.products = addIfNotPresent(state.products, payload, true);
  }),
  addProducts: action((state, payload) => {
    state.inited = true;
    state.loading = false;
    state.products = addIfNotPresent(state.products, payload);
  }),
  updateProduct: action((state, payload) => {
    const {
      _id,
      updateDescription: { removedFields = [], updatedFields = {} },
    } = payload;
    state.products = state.products.map((product) => {
      if (product._id !== _id) return product;

      for (let key of removedFields) {
        lodash.unset(product, key);
      }

      for (let key in updatedFields) {
        lodash.set(product, key, updatedFields[key]);
      }

      return product;
    });
  }),
  replaceProduct: action((state, payload) => {
    const { _id, data } = payload;
    state.products = state.products.map((product) => {
      if (product._id === _id) return { ...data };
      return product;
    });
  }),
  removeProduct: action((state, payload) => {
    state.products = state.products.filter((product) => product._id !== payload);
  }),
  setProducts: action((state, payload) => {
    for (const key in payload) {
      state[key] = payload[key];
    }
    if (typeof payload.loading === "undefined") state.loading = false;
    if (typeof payload.inited === "undefined") state.inited = true;
  }),
};
