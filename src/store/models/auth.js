import { action } from "easy-peasy";

export const authModel = {
  loading: true,
  user: null,
  setAuth: action((state, payload) => {
    state.user = payload.user;
    state.loading = false;
  }),
  setUser: action((state, payload) => {
    state.user = payload;
  }),
};
