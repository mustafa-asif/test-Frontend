import { AUTH_URL, xFetch } from "./constants";

export const xLogin = async (body) => {
  return await xFetch("/auth/login", { method: "POST", body }, undefined, AUTH_URL);
};

export const xRegister = async (body) => {
  return await xFetch("/auth/register", { method: "POST", body });
};

export const xLogout = async () => {
  return await xFetch("/auth/logout", { method: "POST" }, undefined, AUTH_URL);
};

export const xState = async () => {
  return await xFetch("/auth/state", undefined, undefined, AUTH_URL);
};

export const xGetText = async (body) => {
  return await xFetch("/auth/get-verify", { method: "POST", body });
};

export const xVerify = async (body) => {
  return await xFetch("/auth/check-verify", { method: "POST", body });
};

export const xEditUser = async (id, body) => {
  return xFetch(`/users/${id}`, { method: "PATCH", body });
};
