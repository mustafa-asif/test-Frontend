import { action } from "easy-peasy";
import { addIfNotPresent } from "../../utils/misc";
import lodash from "lodash";

export const clientsModel = {
  inited: false,
  loading: true,
  clients: [],
  listening: false,
  setListening: action((state, payload = true) => {
    state.listening = payload;
  }),
  setInited: action((state, payload = true) => {
    state.inited = payload;
  }),
  addClient: action((state, payload) => {
    state.clients = addIfNotPresent(state.clients, payload, true);
  }),
  addClients: action((state, payload) => {
    state.inited = true;
    state.loading = false;
    state.clients = addIfNotPresent(state.clients, payload);
  }),
  updateClient: action((state, payload) => {
    const {
      _id,
      updateDescription: { removedFields, updatedFields },
    } = payload;
    state.clients = state.clients.map((client) => {
      if (client._id !== _id) return client;

      for (let key of removedFields) {
        lodash.unset(client, key);
      }

      for (let key in updatedFields) {
        lodash.set(client, key, updatedFields[key]);
      }

      return client;
    });
  }),
  replaceClient: action((state, payload) => {
    const { _id, data } = payload;
    state.clients = state.clients.map((client) => {
      if (client._id === _id) return { ...data, pinned: client.pinned };
      return client;
    });
  }),
  removeClient: action((state, payload) => {
    state.clients = state.clients.filter((client) => client._id !== payload);
  }),
  setClients: action((state, payload) => {
    for (const key in payload) {
      state[key] = payload[key];
    }
    if (typeof payload.loading === "undefined") state.loading = false;
    if (typeof payload.inited === "undefined") state.inited = true;
  }),
};
