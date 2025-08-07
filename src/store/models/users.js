import { action } from "easy-peasy";
import { addIfNotPresent } from "../../utils/misc";
import lodash from "lodash";

export const usersModel = {
  inited: false,
  loading: true,
  users: [],
  listening: false,
  setListening: action((state, payload = true) => {
    state.listening = payload;
  }),
  setInited: action((state, payload = true) => {
    state.inited = payload;
  }),
  addUser: action((state, payload) => {
    state.users = addIfNotPresent(state.users, payload, true);
  }),
  addUsers: action((state, payload) => {
    state.inited = true;
    state.loading = false;
    state.users = addIfNotPresent(state.users, payload);
  }),
  updateUser: action((state, payload) => {
    const {
      _id,
      updateDescription: { removedFields, updatedFields },
    } = payload;
    state.users = state.users.map((user) => {
      if (user._id !== _id) return user;

      for (let key of removedFields) {
        lodash.unset(user, key);
      }

      for (let key in updatedFields) {
        lodash.set(user, key, updatedFields[key]);
      }

      return user;
    });
  }),
  replaceUser: action((state, payload) => {
    const { _id, data } = payload;
    state.users = state.users.map((user) => {
      if (user._id === _id) return { ...data, pinned: user.pinned };
      return user;
    });
  }),
  removeUser: action((state, payload) => {
    state.users = state.users.filter((user) => user._id !== payload);
  }),
  setUsers: action((state, payload) => {
    for (const key in payload) {
      state[key] = payload[key];
    }
    if (typeof payload.loading === "undefined") state.loading = false;
    if (typeof payload.inited === "undefined") state.inited = true;
  }),
};
