import { action } from "easy-peasy";

export const dashboardModel = {
  inited: false,
  loading: true,
  stats: null,
  setInited: action((state, payload = true) => {
    state.inited = payload;
  }),
  setDashboard: action((state, payload) => {
    state.stats = payload.stats ?? {};
    state.loading = payload.loading ?? false;
    state.inited = payload.inited ?? true;
  }),
};
