import { action } from "easy-peasy";
import { addIfNotPresent } from "../../utils/misc";
import lodash from "lodash";

export const snapshotsModel = {
  inited: false,
  loading: true,
  snapshots: [],
  listening: false,
  setListening: action((state, payload = true) => {
    state.listening = payload;
  }),
  setInited: action((state, payload = true) => {
    state.inited = payload;
  }),
  addSnapshot: action((state, payload) => {
    state.snapshots = addIfNotPresent(state.snapshots, payload, true);
  }),
  addSnapshots: action((state, payload) => {
    state.inited = true;
    state.loading = false;
    state.snapshots = addIfNotPresent(state.snapshots, payload);
  }),
  removeSnapshot: action((state, payload) => {
    state.snapshots = state.snapshots.filter((snapshot) => snapshot._id !== payload);
  }),
  setSnapshots: action((state, payload) => {
    for (const key in payload) {
      state[key] = payload[key];
    }
    if (typeof payload.loading === "undefined") state.loading = false;
    if (typeof payload.inited === "undefined") state.inited = true;
  }),
};
