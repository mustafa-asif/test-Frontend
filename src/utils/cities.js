import { xFetch } from "./constants";

export const xGetCities = async () => {
  return await xFetch(`/cities`);
};
