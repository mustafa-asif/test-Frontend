import { action } from "easy-peasy";
import { addIfNotPresent } from "../../utils/misc";
import lodash from "lodash";

export const notificationsModel = {
  inited: false,
  loading: true,
  notifications: [],
  setInited: action((state, payload = true) => {
    state.inited = payload;
  }),
  addNotification: action((state, payload) => {
    state.notifications = addIfNotPresent(state.notifications, payload, true);
  }),
  addNotifications: action((state, payload) => {
    state.inited = true;
    state.loading = false;
    state.notifications = addIfNotPresent(state.notifications, payload);
  }),
  updateNotification: action((state, payload) => {
    const {
      _id,
      updateDescription: { removedFields, updatedFields },
    } = payload;
    state.notifications = state.notifications.map((notification) => {
      if (notification._id !== _id) return notification;

      for (let key of removedFields) {
        lodash.unset(notification, key);
      }

      for (let key in updatedFields) {
        lodash.set(notification, key, updatedFields[key]);
      }

      return notification;
    });
  }),
  replaceNotification: action((state, payload) => {
    const { _id, data } = payload;
    state.notifications = state.notifications.map((notification) => {
      if (notification._id === _id) return { ...data, pinned: notification.pinned };
      return notification;
    });
  }),
  removeNotification: action((state, payload) => {
    state.notifications = state.notifications.filter(
      (notification) => notification._id !== payload
    );
  }),
  setNotifications: action((state, payload) => {
    for (const key in payload) {
      state[key] = payload[key];
    }
    if (typeof payload.loading === "undefined") state.loading = false;
    if (typeof payload.inited === "undefined") state.inited = true;
  }),
};
