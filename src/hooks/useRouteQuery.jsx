import { useLocation } from "react-router-dom";

export const useRouteQuery = (key) => {
  return new URLSearchParams(useLocation().search).get(key);
};
