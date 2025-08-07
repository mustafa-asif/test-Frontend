import { xFetch } from "./constants";

export const xGetCyles = async () => {
  return await xFetch(`/cycles`);
};

export const xAddPayment = async (body) => {
  return await xFetch(`/cycles/payments`, { method: "POST", body });
};
