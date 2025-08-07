import { xFetch } from "./constants";

export const xAddDeliverer = async (body) => {
  return await xFetch(`/users`, { method: "POST", body });
};
