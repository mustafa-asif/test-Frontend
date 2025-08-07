import { action } from "easy-peasy";
import { addIfNotPresent } from "../../utils/misc";
import lodash from "lodash";

export const documentsModel = {
  inited: false,
  loading: true,
  documents: [],
  listening: false,
  setListening: action((state, payload = true) => {
    state.listening = payload;
  }),
  setInited: action((state, payload = true) => {
    state.inited = payload;
  }),
  addDocument: action((state, payload) => {
    state.documents = addIfNotPresent(state.documents, payload, true);
  }),
  addDocuments: action((state, payload) => {
    state.inited = true;
    state.loading = false;
    state.documents = addIfNotPresent(state.documents, payload);
  }),
  updateDocument: action((state, payload) => {
    const {
      _id,
      updateDescription: { removedFields, updatedFields },
    } = payload;
    state.documents = state.documents.map((document) => {
      if (document._id !== _id) return document;

      for (let key of removedFields) {
        lodash.unset(document, key);
      }

      for (let key in updatedFields) {
        lodash.set(document, key, updatedFields[key]);
      }

      return document;
    });
  }),
  replaceDocument: action((state, payload) => {
    const { _id, data } = payload;
    state.documents = state.documents.map((document) => {
      if (document._id === _id) return { ...data, pinned: document.pinned };
      return document;
    });
  }),
  removeDocument: action((state, payload) => {
    state.documents = state.documents.filter((document) => document._id !== payload);
  }),
  setDocuments: action((state, payload) => {
    for (const key in payload) {
      state[key] = payload[key];
    }
    if (typeof payload.loading === "undefined") state.loading = false;
    if (typeof payload.inited === "undefined") state.inited = true;
  }),
};
