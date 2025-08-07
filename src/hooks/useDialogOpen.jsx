import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export const useDialogOpen = (path) => {
  const location = useLocation();
  return useMemo(() => {
    return location.pathname.includes(path);
  }, [location.pathname, path]);
};
