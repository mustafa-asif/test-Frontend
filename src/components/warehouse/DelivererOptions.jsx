import { useEffect } from "react";
import { useContext, useState } from "react";
import { createContext } from "react";
import { xFetch } from "../../utils/constants";

const context = createContext({
  options: [],
  deliverer: null,
  setDeliverer: (val) => { },
});

export const DelivererOptions = ({ children }) => {
  const [options, setOptions] = useState([]);
  const [deliverer, setDeliverer] = useState(null);

  async function fetchDeliverers() {
    const { data, error } = await xFetch("/input_deliverers/options");
    if (error) return console.log(error);
    if (data) {
      setOptions(data);
      setDeliverer(getCachedValue(data));
    }
  }

  const cached_key = "__cached_deliverer_option";

  function setAndCacheDeliverer(value) {
    setDeliverer(value);
    if (!value) return localStorage.removeItem(cached_key);
    localStorage.setItem(cached_key, JSON.stringify(value));
  }

  function getCachedValue(options) {
    try {
      let value = localStorage.getItem(cached_key);
      if (!value) return null;
      value = JSON.parse(value);
      return options.find((opt) => opt._id === value?._id);
    } catch (err) {
      return null;
    }
  }

  useEffect(() => {
    fetchDeliverers();
  }, []);

  return (
    <context.Provider value={{ options, deliverer, setDeliverer: setAndCacheDeliverer }}>
      {children}
    </context.Provider>
  );
};

export const useDelivererOptions = () => {
  return useContext(context);
};
