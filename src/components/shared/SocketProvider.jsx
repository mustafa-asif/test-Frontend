import { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client";
import { WS_URL } from "../../utils/constants";

export const SocketContext = createContext({ socket: null });

export const SocketProvider = ({ children }) => {
  console.log("socket provider rendered");

  const socket = useMemo(() => {
    const sc = io(WS_URL, {
      withCredentials: true,
      reconnectionDelayMax: 10000,
      reconnectionDelay: 3000,
      reconnectionAttempts: 2,
    });

    sc.on("error", (e) => console.log("socket error", e));
    sc.on("connect_error", (err) => {
      console.log(err);
      console.log(`connect_error due to ${err}`);
    });

    sc.on("welcome", () => console.log(`successfully welcomed!`));

    return sc;
  }, []);

  return (
    //
    <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>
    //
  );
};

export const useSocket = () => useContext(SocketContext).socket;
