import { xFetch } from "./constants";

export const xAddShipper = async (body) => {
  return await xFetch(`/shippers`, { method: "POST", body });
};
