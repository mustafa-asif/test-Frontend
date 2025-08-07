import { action } from "easy-peasy";
import { addIfNotPresent } from "../../utils/misc";
import lodash from "lodash";

export const containersModel = {
  inited: false,
  loading: true,
  containers: [],
  listening: false,
  setListening: action((state, payload = true) => {
    state.listening = payload;
  }),
  setInited: action((state, payload = true) => {
    state.inited = payload;
  }),
  addContainer: action((state, payload) => {
    state.containers = addIfNotPresent(state.containers, payload, true);
  }),
  addMessages: action((state, payload) => {
    const { messages, _id, prepend, override } = payload;
    state.containers = state.containers.map((container) => {
      if (container._id !== _id) return container;
      if (override) {
        container.messages = messages;
        return container;
      }
      container.messages = addIfNotPresent(container.messages, messages, prepend);
      return container;
    });
  }),
  addEvents: action((state, payload) => {
    const { events, _id, prepend, override } = payload;
    state.containers = state.containers.map((container) => {
      if (container._id !== _id) return container;
      if (override) {
        container.events = events;
        return container;
      }
      container.events = addIfNotPresent(container.events, events, prepend);
      return container;
    });
  }),
  addContainers: action((state, payload) => {
    state.inited = true;
    state.loading = false;
    state.containers = addIfNotPresent(state.containers, payload);
  }),
  updateContainer: action((state, payload) => {
    const {
      _id,
      updateDescription: { removedFields, updatedFields },
    } = payload;
    state.containers = state.containers.map((container) => {
      if (container._id !== _id) return container;

      for (let key of removedFields) {
        lodash.unset(container, key);
      }

      for (let key in updatedFields) {
        lodash.set(container, key, updatedFields[key]);
      }

      return container;
    });
  }),
  replaceContainer: action((state, payload) => {
    const { _id, data } = payload;
    state.containers = state.containers.map((container) => {
      if (container._id === _id) return { ...data, pinned: container.pinned };
      return container;
    });
  }),
  removeContainer: action((state, payload) => {
    state.containers = state.containers.filter((container) => container._id !== payload);
  }),
  setContainers: action((state, payload) => {
    for (const key in payload) {
      state[key] = payload[key];
    }
    if (typeof payload.loading === "undefined") state.loading = false;
    if (typeof payload.inited === "undefined") state.inited = true;
  }),
};
