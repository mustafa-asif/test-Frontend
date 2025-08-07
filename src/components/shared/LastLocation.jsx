import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

const Context = createContext({ lastLocation: "" });

export const LastLocationProvider = ({ children }) => {
  const [timeline, setTimeline] = useState([]);
  const location = useLocation();

  const updateTimeline = useCallback(
    (newRoute) => {
      // if (timeline.length === 1) { why?
      //   return setTimeline((timeline) => [newRoute, timeline[0]]);
      // }
      return setTimeline((timeline) => [newRoute, ...timeline]);
    },
    [timeline]
  );

  useEffect(() => {
    updateTimeline(location.pathname);
  }, [location.pathname]);

  return <Context.Provider value={{ lastLocation: timeline[1] }}>{children}</Context.Provider>;
};

// export const useLastLocation = () => {
//   return useContext(Context).lastLocation;
// };

export const useGoBack = (fallback, force) => {
  const lastLocation = useContext(Context).lastLocation;
  const history = useHistory();
  return function () {
    if (lastLocation && !force) return history.goBack();
    history.replace(fallback);
  };
};

export const useBackClose = (route) => {
  const lastLocation = useContext(Context).lastLocation;
  const history = useHistory();
  if (!lastLocation?.includes(route)) return () => history.push(route);
  else return () => history.goBack();
};
