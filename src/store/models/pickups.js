import { action } from "easy-peasy";
import { addIfNotPresent } from "../../utils/misc";
import lodash from "lodash";

export const pickupsModel = {
  inited: false,
  loading: true,
  pickups: [],
  listening: false,
  setListening: action((state, payload = true) => {
    state.listening = payload;
  }),
  setInited: action((state, payload = true) => {
    state.inited = payload;
  }),
  addPickup: action((state, payload) => {
    state.pickups = addIfNotPresent(state.pickups, payload, true);
  }),
  addMessages: action((state, payload) => {
    const { messages, _id, prepend, override } = payload;
    state.pickups = state.pickups.map((pickup) => {
      if (pickup._id !== _id) return pickup;
      if (override) {
        pickup.messages = messages;
        return pickup;
      }

      pickup.messages = addIfNotPresent(pickup.messages, messages, prepend);
      return pickup;
    });
  }),
  addEvents: action((state, payload) => {
    const { events, _id, prepend, override } = payload;
    state.pickups = state.pickups.map((pickup) => {
      if (pickup._id !== _id) return pickup;
      if (override) {
        pickup.events = events;
        return pickup;
      }
      pickup.events = addIfNotPresent(pickup.events, events, prepend);
      return pickup;
    });
  }),
  addPickups: action((state, payload) => {
    state.inited = true;
    state.loading = false;
    state.pickups = addIfNotPresent(state.pickups, payload);
  }),
  updatePickup: action((state, payload) => {
    const {
      _id,
      updateDescription: { removedFields, updatedFields },
    } = payload;
    state.pickups = state.pickups.map((pickup) => {
      if (pickup._id !== _id) return pickup;

      for (let key of removedFields) {
        lodash.unset(pickup, key);
      }

      for (let key in updatedFields) {
        lodash.set(pickup, key, updatedFields[key]);
      }

      return pickup;
    });
  }),
  replacePickup: action((state, payload) => {
    const { _id, data } = payload;
    state.pickups = state.pickups.map((pickup) => {
      if (pickup._id === _id) return { ...data, pinned: pickup.pinned };
      return pickup;
    });
  }),
  removePickup: action((state, payload) => {
    state.pickups = state.pickups.filter((pickup) => pickup._id !== payload);
  }),
  setPickups: action((state, payload) => {
    for (const key in payload) {
      state[key] = payload[key];
    }
    if (typeof payload.loading === "undefined") state.loading = false;
    if (typeof payload.inited === "undefined") state.inited = true;
  }),
};
