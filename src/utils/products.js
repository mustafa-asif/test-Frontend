import { xFetch } from "./constants";

export const xDelProduct = async (id) => {
  return await xFetch(`/products/${id}`, { method: "DELETE" });
};

export const xAddProduct = async (body) => {
  return await xFetch("/products", { method: "POST", body });
};

export const xGetClientProducts = async (client_id, query = {}) => {
  const queries = [];
  for (let [key, value] of Object.entries(query)) {
    if (!value) continue;
    queries.push(`${key}=${value}`);
  }
  return await xFetch(`/products/input`, undefined, undefined, undefined, [
    `client_id=${client_id}`,
    ...queries,
  ]);
};

export const xGetProducts = async () => {
  return await xFetch(`/products`);
};
