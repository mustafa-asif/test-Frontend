import { xFetch } from "./constants";

export const xGetPickups = async () => {
  return await xFetch(`/pickups`);
};

export const xAddPickup = async (body) => {
  return await xFetch("/pickups", { method: "POST", body });
};
