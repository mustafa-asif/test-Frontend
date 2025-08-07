import { action } from "easy-peasy";
import { addIfNotPresent } from "../../utils/misc";
import lodash from "lodash";

export const fetusesModel = {
  inited: false,
  loading: true,
  fetuses: [],
  setInited: action((state, payload = true) => {
    state.inited = payload;
  }),
  addFetus: action((state, payload) => {
    state.fetuses = addIfNotPresent(state.fetuses, payload, true);
  }),
  addFetuses: action((state, payload) => {
    state.inited = true;
    state.loading = false;
    state.fetuses = addIfNotPresent(state.fetuses, payload);
  }),
  updateFetus: action((state, payload) => {
    const {
      _id,
      updateDescription: { removedFields, updatedFields },
    } = payload;
    state.fetuses = state.fetuses.map((fetus) => {
      if (fetus._id !== _id) return fetus;

      for (let key of removedFields) {
        lodash.unset(fetus, key);
      }

      for (let key in updatedFields) {
        lodash.set(fetus, key, updatedFields[key]);
      }

      return fetus;
    });
  }),
  replaceFetus: action((state, payload) => {
    const { _id, data } = payload;
    state.fetuses = state.fetuses.map((fetus) => {
      if (fetus._id === _id) return { ...data, pinned: fetus.pinned };
      return fetus;
    });
  }),
  removeFetus: action((state, payload) => {
    state.fetuses = state.fetuses.filter((fetus) => fetus._id !== payload);
  }),
  setFetuses: action((state, payload) => {
    for (const key in payload) {
      state[key] = payload[key];
    }
    if (typeof payload.loading === "undefined") state.loading = false;
    if (typeof payload.inited === "undefined") state.inited = true;
  }),
};
