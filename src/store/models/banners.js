import { action } from "easy-peasy";
import { addIfNotPresent } from "../../utils/misc";
import lodash from "lodash";

export const bannersModel = {
  inited: false,
  loading: true,
  banners: [],
  setInited: action((state, payload = true) => {
    state.inited = payload;
  }),
  addBanner: action((state, payload) => {
    state.banners = addIfNotPresent(state.banners, payload, true);
  }),
  addBanners: action((state, payload) => {
    state.inited = true;
    state.loading = false;
    state.banners = addIfNotPresent(state.banners, payload);
  }),
  removeBanner: action((state, payload) => {
    state.banners = state.banners.filter((banner) => banner._id !== payload);
  }),
  setBanners: action((state, payload) => {
    for (const key in payload) {
      state[key] = payload[key];
    }
    if (typeof payload.loading === "undefined") state.loading = false;
    if (typeof payload.inited === "undefined") state.inited = true;
  }),
};
