import { xFetch } from "./constants";

export const xGetItems = async () => {
  return xFetch("/items");
};

export const xCreateItems = async (body) => {
  return xFetch("/items", { method: "POST", body });
};
