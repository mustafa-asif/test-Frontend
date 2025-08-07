import { action } from "easy-peasy";
import { addIfNotPresent } from "../../utils/misc";
import lodash from "lodash";

export const SupportCategoryModel = {
  inited: false,
  loading: true,
  supportCategories: [],
  setInited: action((state, payload = true) => {
    state.inited = payload;
  }),
  addSupportCategory: action((state, payload) => {
    state.supportCategories = addIfNotPresent(state.supportCategories, payload, true);
  }),
  addSupportCategories: action((state, payload) => {
    state.inited = true;
    state.loading = false;
    state.supportCategories = addIfNotPresent(state.supportCategories, payload);
  }),
  removeSupportCategory: action((state, payload) => {
    state.supportCategories = state.supportCategories.filter((supportCategory) => supportCategory._id !== payload);
  }),
  setSupportCategories: action((state, payload) => {
    for (const key in payload) {
      state[key] = payload[key];
    }
    if (typeof payload.loading === "undefined") state.loading = false;
    if (typeof payload.inited === "undefined") state.inited = true;
  }),
};