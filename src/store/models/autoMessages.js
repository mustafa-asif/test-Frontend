import { action } from "easy-peasy";
import { addIfNotPresent } from "../../utils/misc";

export const AutoMessageModel = {
  inited: false,
  loading: true,
  autoMessages: [],
  setInited: action((state, payload = true) => {
    state.inited = payload;
  }),
  addAutoMessage: action((state, payload) => {
    state.supportCategories = addIfNotPresent(state.autoMessages, payload, true);
  }),
  addAutoMessages: action((state, payload) => {
    state.inited = true;
    state.loading = false;
    state.autoMessages = addIfNotPresent(state.autoMessages, payload);
  }),
  removeAutoMessage: action((state, payload) => {
    state.autoMessages = state.autoMessages.filter((AutoMessage) => AutoMessage._id !== payload);
  }),
  setAutoMessages: action((state, payload) => {
    for (const key in payload) {
      state[key] = payload[key];
    }
    if (typeof payload.loading === "undefined") state.loading = false;
    if (typeof payload.inited === "undefined") state.inited = true;
  }),
};