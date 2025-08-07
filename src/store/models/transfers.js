import { action } from "easy-peasy";
import { addIfNotPresent } from "../../utils/misc";
import lodash from "lodash";

export const transfersModel = {
  inited: false,
  loading: true,
  transfers: [],
  listening: false,
  setListening: action((state, payload = true) => {
    state.listening = payload;
  }),
  setInited: action((state, payload = true) => {
    state.inited = payload;
  }),
  addTransfer: action((state, payload) => {
    state.transfers = addIfNotPresent(state.transfers, payload, true);
  }),
  addMessages: action((state, payload) => {
    const { messages, _id, prepend, override } = payload;
    state.transfers = state.transfers.map((transfer) => {
      if (transfer._id !== _id) return transfer;
      if (override) {
        transfer.messages = messages;
        return transfer;
      }
      transfer.messages = addIfNotPresent(transfer.messages, messages, prepend);
      return transfer;
    });
  }),
  addEvents: action((state, payload) => {
    const { events, _id, prepend, override } = payload;
    state.transfers = state.transfers.map((transfer) => {
      if (transfer._id !== _id) return transfer;
      if (override) {
        transfer.events = events;
        return transfer;
      }
      transfer.events = addIfNotPresent(transfer.events, events, prepend);
      return transfer;
    });
  }),
  addTransfers: action((state, payload) => {
    state.inited = true;
    state.loading = false;
    state.transfers = addIfNotPresent(state.transfers, payload);
  }),
  updateTransfer: action((state, payload) => {
    const {
      _id,
      updateDescription: { removedFields, updatedFields },
    } = payload;
    state.transfers = state.transfers.map((transfer) => {
      if (transfer._id !== _id) return transfer;

      for (let key of removedFields) {
        lodash.unset(transfer, key);
      }

      for (let key in updatedFields) {
        lodash.set(transfer, key, updatedFields[key]);
      }

      return transfer;
    });
  }),
  replaceTransfer: action((state, payload) => {
    const { _id, data } = payload;
    state.transfers = state.transfers.map((transfer) => {
      if (transfer._id === _id) return { ...data, pinned: transfer.pinned };
      return transfer;
    });
  }),
  removeTransfer: action((state, payload) => {
    state.transfers = state.transfers.filter((transfer) => transfer._id !== payload);
  }),
  setTransfers: action((state, payload) => {
    for (const key in payload) {
      state[key] = payload[key];
    }
    if (typeof payload.loading === "undefined") state.loading = false;
    if (typeof payload.inited === "undefined") state.inited = true;
  }),
};
