import { xFetch } from "./constants";

export const xAddPurge = async (body) => {
  return await xFetch("/purges", { method: "POST", body });
};
