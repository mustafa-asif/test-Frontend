import { action } from "easy-peasy";
import { addIfNotPresent } from "../../utils/misc";
import lodash from "lodash";

export const purgesModel = {
  inited: false,
  loading: true,
  purges: [],
  selected_ids: [],
  listening: false,
  setListening: action((state, payload = true) => {
    state.listening = payload;
  }),
  setInited: action((state, payload = true) => {
    state.inited = payload;
  }),
  addPurge: action((state, payload) => {
    state.purges = addIfNotPresent(state.purges, payload, true);
  }),
  addPurges: action((state, payload) => {
    state.inited = true;
    state.loading = false;
    state.purges = addIfNotPresent(state.purges, payload);
  }),
  updatePurge: action((state, payload) => {
    const {
      _id,
      updateDescription: { removedFields, updatedFields },
    } = payload;
    state.purges = state.purges.map((purge) => {
      if (purge._id !== _id) return purge;

      for (let key of removedFields) {
        lodash.unset(purge, key);
      }

      for (let key in updatedFields) {
        lodash.set(purge, key, updatedFields[key]);
      }

      return purge;
    });
  }),
  replacePurge: action((state, payload) => {
    const { _id, data } = payload;
    state.purges = state.purges.map((purge) => {
      if (purge._id === _id) return { ...data, pinned: purge.pinned };
      return purge;
    });
  }),
  removePurge: action((state, payload) => {
    state.purges = state.purges.filter((purge) => purge._id !== payload);
  }),
  setPurges: action((state, payload) => {
    for (const key in payload) {
      state[key] = payload[key];
    }
    if (typeof payload.loading === "undefined") state.loading = false;
    if (typeof payload.inited === "undefined") state.inited = true;
  }),
  addMessages: action((state, payload) => {
    const { messages, _id, prepend, override } = payload;
    state.purges = state.purges.map((purge) => {
      if (purge._id !== _id) return purge;
      if (override) {
        purge.messages = messages;
        return purge;
      }

      purge.messages = addIfNotPresent(purge.messages, messages, prepend);
      return purge;
    });
  }),
  setSelectedPurges: action((state, payload) => {
    const { _id, client } = payload; 

    const index = state.selected_ids.findIndex((purge) => purge._id === _id);

    if (index > -1) {
      state.selected_ids.splice(index, 1);
    } else {
      state.selected_ids.push({ _id, client });
    }
  }),
};
