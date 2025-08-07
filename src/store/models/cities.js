import { action } from "easy-peasy";

export const citiesModel = {
  loading: true,
  inited: false,
  cities: [],
  setInited: action((state, payload = true) => {
    state.inited = payload;
  }),
  setCities: action((state, payload) => {
    for (const key in payload) {
      state[key] = payload[key];
    }
    if (typeof payload.loading === "undefined") state.loading = false;
    if (typeof payload.inited === "undefined") state.inited = true;
  }),
};
