import { action } from "easy-peasy";
import { addIfNotPresent } from "../../utils/misc";

export const systemEventsModel = {
  inited: false,
  loading: true,
  systemEvents: [],
  listening: false,
  setListening: action((state, payload = true) => {
    state.listening = payload;
  }),
  setInited: action((state, payload = true) => {
    state.inited = payload;
  }),
  addSystemEvent: action((state, payload) => {
    state.systemEvents = addIfNotPresent(state.systemEvents, payload, true);
  }),
  addSystemEvents: action((state, payload) => {
    state.inited = true;
    state.loading = false;
    state.systemEvents = addIfNotPresent(state.systemEvents, payload);
  }),
  removeSystemEvent: action((state, payload) => {
    state.systemEvents = state.systemEvents.filter((event) => event._id !== payload);
  }),
  setSystemEvents: action((state, payload) => {
    for (const key in payload) {
      state[key] = payload[key];
    }
    if (typeof payload.loading === "undefined") state.loading = false;
    if (typeof payload.inited === "undefined") state.inited = true;
  }),
}; 