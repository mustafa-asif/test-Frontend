import { useRef, createContext, useEffect, useContext } from "react";

const context = createContext({ playSound: (sound_name) => {} });

export const SoundsProvider = ({ children }) => {
  const done = useRef(new Audio("/sounds/done.mp3")).current;
  const scanerror = useRef(new Audio("/sounds/scan-error.mp3")).current;
  const scansuccess = useRef(new Audio("/sounds/scan-success.mp3")).current;

  function playSound(sound_name) {
    console.log(`playing sound: ${sound_name}`);
    switch (sound_name) {
      case "done":
        return done.play();
      case "scan-error":
        return scanerror.play();
      case "scan-success":
        return scansuccess.play();
      default:
        console.log(`sound: '${sound_name}' not recognized`);
        break;
    }
  }

  function loadSounds() {
    done.load();
    scanerror.load();
    scansuccess.load();
  }

  useEffect(() => {
    loadSounds();
  }, []);
  return (
    <context.Provider value={{ playSound }}>
      {/*  */}

      {children}
      {/*  */}
    </context.Provider>
  );
};

export const usePlaySound = () => {
  return useContext(context).playSound;
};
