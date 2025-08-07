import { action } from "easy-peasy";
import { addIfNotPresent } from "../../utils/misc";
import lodash from "lodash";

export const itemsModel = {
  inited: false,
  loading: true,
  items: [],
  setInited: action((state, payload = true) => {
    state.inited = payload;
  }),
  addItem: action((state, payload) => {
    state.items = addIfNotPresent(state.items, payload, true);
  }),
  addEvents: action((state, payload) => {
    const { events, _id, prepend, override } = payload;
    state.items = state.items.map((item) => {
      if (item._id !== _id) return item;
      if (override) {
        item.events = events;
        return item;
      }
      item.events = addIfNotPresent(item.events, events, prepend);
      return item;
    });
  }),
  addItems: action((state, payload) => {
    state.inited = true;
    state.loading = false;
    state.items = addIfNotPresent(state.items, payload);
  }),
  updateItem: action((state, payload) => {
    const {
      _id,
      updateDescription: { removedFields, updatedFields },
    } = payload;
    state.items = state.items.map((item) => {
      if (item._id !== _id) return item;

      for (let key of removedFields) {
        lodash.unset(item, key);
      }

      for (let key in updatedFields) {
        lodash.set(item, key, updatedFields[key]);
      }

      return item;
    });
  }),
  replaceItem: action((state, payload) => {
    const { _id, data } = payload;
    state.items = state.items.map((item) => {
      if (item._id === _id) return { ...data };
      return item;
    });
  }),
  removeItem: action((state, payload) => {
    state.items = state.items.filter((item) => item._id !== payload);
  }),
  setItems: action((state, payload) => {
    for (const key in payload) {
      state[key] = payload[key];
    }
    if (typeof payload.loading === "undefined") state.loading = false;
    if (typeof payload.inited === "undefined") state.inited = true;
  }),
};
