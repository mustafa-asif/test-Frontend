import { xFetch } from "./constants";

export const xGetTransfers = async () => {
  return await xFetch(`/transfers`);
};

export const xAddTransfer = async (body) => {
  return await xFetch("/transfers", { method: "POST", body });
};
