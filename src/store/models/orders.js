import { action } from "easy-peasy";
import { addIfNotPresent } from "../../utils/misc";
import lodash from "lodash";

export const ordersModel = {
  inited: false,
  loading: true,
  orders: [],
  listening: false,
  setListening: action((state, payload = true) => {
    state.listening = payload;
  }),
  setInited: action((state, payload = true) => {
    state.inited = payload;
  }),
  addOrder: action((state, payload) => {
    state.orders = addIfNotPresent(state.orders, payload, true);
  }),
  addMessages: action((state, payload) => {
    const { messages, _id, prepend, override } = payload;
    state.orders = state.orders.map((order) => {
      if (order._id !== _id) return order;
      if (override) {
        order.messages = messages;
        return order;
      }
      order.messages = addIfNotPresent(order.messages, messages, prepend);
      return order;
    });
  }),
  addEvents: action((state, payload) => {
    const { events, _id, prepend, override } = payload;
    state.orders = state.orders.map((order) => {
      if (order._id !== _id) return order;
      if (override) {
        order.events = events;
        return order;
      }
      order.events = addIfNotPresent(order.events, events, prepend);
      return order;
    });
  }),
  addOrders: action((state, payload) => {
    state.inited = true;
    state.loading = false;
    state.orders = addIfNotPresent(state.orders, payload);
  }),
  updateOrder: action((state, payload) => {
    const {
      _id,
      updateDescription: { removedFields, updatedFields },
    } = payload;
    state.orders = state.orders.map((order) => {
      if (order._id !== _id) return order;

      for (let key of removedFields) {
        lodash.unset(order, key);
      }

      for (let key in updatedFields) {
        lodash.set(order, key, updatedFields[key]);
      }

      return order;
    });
  }),
  replaceOrder: action((state, payload) => {
    const { _id, data } = payload;
    let found = false;
    state.orders = state.orders.map((order) => {
      if (order._id !== _id) return order;
      found = true;
      return { ...data, pinned: order.pinned };
    });

    if (!found) {
      state.orders = [data, ...state.orders];
    }
  }),
  removeOrder: action((state, payload) => {
    state.orders = state.orders.filter((order) => order._id !== payload);
  }),
  setOrders: action((state, payload) => {
    for (const key in payload) {
      state[key] = payload[key];
    }
    if (typeof payload.loading === "undefined") state.loading = false;
    if (typeof payload.inited === "undefined") state.inited = true;
  }),
};
