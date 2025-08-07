import { action } from "easy-peasy";
import { addIfNotPresent } from "../../utils/misc";
import lodash from "lodash";

export const invoicesModel = {
  inited: false,
  loading: true,
  invoices: [],
  setInited: action((state, payload = true) => {
    state.inited = payload;
  }),
  addInvoice: action((state, payload) => {
    state.invoices = addIfNotPresent(state.invoices, payload, true);
  }),
  addInvoices: action((state, payload) => {
    state.inited = true;
    state.loading = false;
    state.invoices = addIfNotPresent(state.invoices, payload);
  }),
  updateInvoice: action((state, payload) => {
    const {
      _id,
      updateDescription: { removedFields, updatedFields },
    } = payload;
    state.invoices = state.invoices.map((invoice) => {
      if (invoice._id !== _id) return invoice;

      for (let key of removedFields) {
        lodash.unset(invoice, key);
      }

      for (let key in updatedFields) {
        lodash.set(invoice, key, updatedFields[key]);
      }

      return invoice;
    });
  }),
  replaceInvoice: action((state, payload) => {
    const { _id, data } = payload;
    state.invoices = state.invoices.map((invoice) => {
      if (invoice._id === _id) return { ...data, pinned: invoice.pinned };
      return invoice;
    });
  }),
  removeInvoice: action((state, payload) => {
    state.invoices = state.invoices.filter((invoice) => invoice._id !== payload);
  }),
  setInvoices: action((state, payload) => {
    for (const key in payload) {
      state[key] = payload[key];
    }
    if (typeof payload.loading === "undefined") state.loading = false;
    if (typeof payload.inited === "undefined") state.inited = true;
  }),
};
