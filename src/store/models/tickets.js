import { action } from "easy-peasy";
import { addIfNotPresent } from "../../utils/misc";
import lodash from "lodash";

export const ticketsModel = {
  inited: false,
  loading: true,
  tickets: [],
  listening: false,
  setListening: action((state, payload = true) => {
    state.listening = payload;
  }),
  setInited: action((state, payload = true) => {
    state.inited = payload;
  }),
  addTicket: action((state, payload) => {
    state.tickets = addIfNotPresent(state.tickets, payload, true);
  }),
  addMessages: action((state, payload) => {
    const { messages, _id, prepend, override } = payload;
    state.tickets = state.tickets.map((ticket) => {
      if (ticket._id !== _id) return ticket;
      if (override) {
        ticket.messages = messages;
        return ticket;
      }
      ticket.messages = addIfNotPresent(ticket.messages, messages, prepend);
      return ticket;
    });
  }),
  addEvents: action((state, payload) => {
    const { events, _id, prepend, override } = payload;
    state.tickets = state.tickets.map((ticket) => {
      if (ticket._id !== _id) return ticket;
      if (override) {
        ticket.events = events;
        return ticket;
      }
      ticket.events = addIfNotPresent(ticket.events, events, prepend);
      return ticket;
    });
  }),
  addTickets: action((state, payload) => {
    state.inited = true;
    state.loading = false;
    state.tickets = addIfNotPresent(state.tickets, payload);
  }),
  updateTicket: action((state, payload) => {
    const {
      _id,
      updateDescription: { removedFields, updatedFields },
    } = payload;
    state.tickets = state.tickets.map((ticket) => {
      if (ticket._id !== _id) return ticket;

      for (let key of removedFields) {
        lodash.unset(ticket, key);
      }

      for (let key in updatedFields) {
        lodash.set(ticket, key, updatedFields[key]);
      }

      return ticket;
    });
  }),
  replaceTicket: action((state, payload) => {
    const { _id, data } = payload;
    state.tickets = state.tickets.map((ticket) => {
      if (ticket._id === _id) return { ...data, pinned: ticket.pinned };
      return ticket;
    });
  }),
  removeTicket: action((state, payload) => {
    state.tickets = state.tickets.filter((ticket) => ticket._id !== payload);
  }),
  setTickets: action((state, payload) => {
    for (const key in payload) {
      state[key] = payload[key];
    }
    if (typeof payload.loading === "undefined") state.loading = false;
    if (typeof payload.inited === "undefined") state.inited = true;
  }),
};
