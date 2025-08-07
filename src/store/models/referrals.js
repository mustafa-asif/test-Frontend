import { action } from "easy-peasy";

export const referralsModel = {
  loading: true,
  inited: false,
  referrals: [],
  stats: {},
  setInited: action((state, payload = true) => {
    state.inited = payload;
  }),
  setReferrals: action((state, payload) => {
    for (const key in payload) {
      state[key] = payload[key];
    }
    if (typeof payload.loading === "undefined") state.loading = false;
    if (typeof payload.inited === "undefined") state.inited = true;
  }),
};
