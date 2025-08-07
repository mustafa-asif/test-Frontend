import { action } from "easy-peasy";
import { addIfNotPresent } from "../../utils/misc";
import lodash from "lodash";

export const runsModel = {
  inited: false,
  loading: true,
  runs: [],
  listening: false,
  setListening: action((state, payload = true) => {
    state.listening = payload;
  }),
  setInited: action((state, payload = true) => {
    state.inited = payload;
  }),
  addRun: action((state, payload) => {
    state.runs = addIfNotPresent(state.runs, payload, true);
  }),
  addRuns: action((state, payload) => {
    state.inited = true;
    state.loading = false;
    state.runs = addIfNotPresent(state.runs, payload);
  }),
  removeRun: action((state, payload) => {
    state.runs = state.runs.filter((run) => run._id !== payload);
  }),
  setRuns: action((state, payload) => {
    for (const key in payload) {
      state[key] = payload[key];
    }
    if (typeof payload.loading === "undefined") state.loading = false;
    if (typeof payload.inited === "undefined") state.inited = true;
  }),
};
