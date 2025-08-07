import { Dialog, useMediaQuery } from "@mui/material";
import { useStoreState } from "easy-peasy";
import { useEffect } from "react";
import { useContext, useState } from "react";
import { createContext } from "react";
import { useToast } from "../../hooks/useToast";
import { xFetch } from "../../utils/constants";
import { cl } from "../../utils/misc";
import { Button, IconButton, SButton } from "./Button";
import { ClientsCombobox } from "./ClientsCombobox";
import { usePrint } from "./ToolsProvider";
import { Label } from "./Label";
import { Checkbox } from "./Input";

const context = createContext({
  printOrders: (ids) => {},
});

export const PrintOrders = ({ children }) => {
  const [ordersToPrint, setOrdersToPrint] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const userRole = useStoreState((state) => state.auth.user.role);

  const blank_filters = { client_id: "", ids: [], includePrintedOrders: true };
  const [filters, setFilters] = useState(blank_filters);
  const [showFilters, setShowFilters] = useState(false);

  const showToast = useToast();
  const showPrint = usePrint();
  const fullScreen = useMediaQuery("(max-width:768px)");

  function printOrders(ids) {
    if (!Array.isArray(ids)) return;

    setDialogOpen(true);

    if (userRole === "warehouse" && ids.length === 0) {
      setFilters({ ...blank_filters, ids });
      setShowFilters(true);
      return;
    }
    getPrintableOrders({ ids });
  }

  async function getPrintableOrders(config) {
    const { ids, client_id } = config;

    const query = [];
    setLoading(true);
    if (ids.length === 1) {
      query.push(`_id=${ids[0]}`);
    }
    if (ids.length > 1) {
      query.push(`_id={$in: [${ids.join(",")}]}`); // wont work
      //   query.push(`_id=${ids.join(",")}`); // safer
    }

    if (client_id) {
      query.push(`client._id=${client_id}`);
    }

    if (!filters.includePrintedOrders) {
      query.push("noPrintedOrders=true");
    }

    const { data, error } = await xFetch(`/orders/printable?${query.join("&")}`);
    if (error) {
      setLoading(false);
      return showToast();
    }
    if (data) {
      setOrdersToPrint(data);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userRole !== "warehouse" || filters.client_id) {
      getPrintableOrders(filters);
    }
  }, [filters.includePrintedOrders, filters.client_id]);

  function handleSubmit(e) {
    e.preventDefault();
    getPrintableOrders(filters);
  }

  function onClose() {
    setOrdersToPrint(null);
    setLoading(false);
    setDialogOpen(false);
    setFilters({ ...blank_filters });
    setShowFilters(false);
  }

  return (
    <context.Provider value={{ printOrders }}>
      {children}
      <Dialog onClose={onClose} open={dialogOpen} fullScreen={fullScreen}>
        <IconButton
          icon="times"
          onClick={onClose}
          className="absolute right-5 top-3 md:hidden z-40 text-gray-800"
          iconColor="gray"
        />
        {showFilters && (
          <form className={cl("py-2 px-3 flex items-center gap-2")} onSubmit={handleSubmit}>
            <label className="block text-md font-medium text-gray-700 font-sans">Client</label>
            <ClientsCombobox
              value={filters.client_id}
              onValueChange={(client_id) => setFilters((filters) => ({ ...filters, client_id }))}
              disabled={isLoading}
              required
            />
            <IconButton icon="arrow-right" type="submit" />
          </form>
        )}
        {isLoading && (
          <div className="py-2 px-3 w-full flex justify-between">
            <span className="animate-pulse text-green-600 font-semibold">Fetching metadata...</span>
          </div>
        )}
        {!isLoading && ordersToPrint?.length < 1 && (
          <div className="py-2 px-3 w-full flex justify-end">
            <div className="flex-1 flex flex-col gap-[2px]">
              <div className="flex items-center gap-[5px]">
                <Label text="Include printed orders" className="text-sm" />
                <Checkbox
                  checked={filters.includePrintedOrders}
                  onValueChange={() =>
                    setFilters({ ...filters, includePrintedOrders: !filters.includePrintedOrders })
                  }
                  disabled={isLoading}
                />
              </div>
            </div>
            <span className="text-gray-600 font-semibold ml-4">No orders</span>
          </div>
        )}
        {!isLoading && ordersToPrint?.length > 0 && (
          <div>
            <div className="grid grid-cols-4 gap-x-3 gap-y-3 overflow-y-scroll rounded-md bg-white text-xl p-6">
              {ordersToPrint.map((or) => (
                <div
                  key={or.order_id}
                  className={`rounded-full h-6 p-3 text-sm flex items-center justify-center cursor-default bg-gray-200 text-gray-500`}>
                  {or.order_id}
                </div>
              ))}
            </div>
            <div className="py-2 px-3 w-full flex justify-end">
              <div className="flex-1 flex flex-col gap-[2px]">
                <div className="flex items-center gap-[5px]">
                  <Label text="Include printed orders" className="text-sm" />
                  <Checkbox
                    checked={filters.includePrintedOrders}
                    onValueChange={() =>
                      setFilters({ ...filters, includePrintedOrders: !filters.includePrintedOrders })
                    }
                    disabled={isLoading}
                  />
                </div>
              </div>
              <IconButton
                icon="print"
                iconColor="red"
                onClick={() => {
                  showPrint(
                    ordersToPrint.map((or) => ({ _id: or.order_id, items: or.items })),
                    { isOrders: true }
                  );
                  onClose();
                }}
              />
            </div>
          </div>
        )}
      </Dialog>
    </context.Provider>
  );
};
/*
<div className="grid grid-cols-4 gap-x-3 gap-y-3 overflow-y-scroll rounded-md bg-white text-xl p-6">
          {orders.map((or) => (
            <div
              key={or.order_id}
              className={`rounded-full h-6 p-3 text-sm flex items-center justify-center cursor-default bg-gray-200 text-gray-500`}>
              {or.order_id}
            </div>
          ))}
        </div>
        <div className="py-2 px-3 w-full flex justify-end">
          {orders.length > 0 && (
            <IconButton
              icon="print"
              iconColor="red"
              onClick={() => {
                showPrint(
                  orders.map((or) => ({ _id: or.order_id, items: or.items })),
                  { isOrders: true }
                );
                onClose();
              }}
            />
          )}
          {orders.length === 0 && !isLoading && <span>No Orders</span>}
        </div>
        <div className="py-2 px-3 w-full flex justify-between">
          {isLoading && (
            <span className="animate-pulse text-green-600 font-semibold">Fetching metadata...</span>
          )}
        </div>
*/
export const usePrintOrders = () => {
  return useContext(context).printOrders;
};
// export const DelivererOptions = ({ children }) => {
//   const [options, setOptions] = useState([]);
//   const [deliverer, setDeliverer] = useState(null);

//   async function fetchDeliverers() {
//     const { data, error } = await xFetch("/input_deliverers/options");
//     if (error) return console.log(error);
//     if (data) {
//       setOptions(data);
//       setDeliverer(getCachedValue(data));
//     }
//   }

//   const cached_key = "__cached_deliverer_option";

//   function setAndCacheDeliverer(value) {
//     setDeliverer(value);
//     if (!value) return localStorage.removeItem(cached_key);
//     localStorage.setItem(cached_key, JSON.stringify(value));
//   }

//   function getCachedValue(options) {
//     try {
//       let value = localStorage.getItem(cached_key);
//       if (!value) return null;
//       value = JSON.parse(value);
//       return options.find((opt) => opt._id === value?._id);
//     } catch (err) {
//       return null;
//     }
//   }

//   useEffect(() => {
//     fetchDeliverers();
//   }, []);

//   return (
//     <context.Provider value={{ options, deliverer, setDeliverer: setAndCacheDeliverer }}>
//       {children}
//     </context.Provider>
//   );
// };

// export const useDelivererOptions = () => {
//   return useContext(context);
// };

export function PrintOrdersButton() {
  const handlePrint = usePrintOrders();

  //   async function fetchPrintableOrders() {
  //     const filters = [];
  //     filters.push(`status=awaiting pickup`, `locked_items=true`);
  //     const { data, error } = await xFetch(`/orders?${filters.join("&")}`);
  //     if (error) return showToast();
  //   }

  return (
    <button
      onClick={() => handlePrint([])}
      className={
        "bg-white px-4 hover:bg-gray-200 hover:text-gray-900 hover:shadow-xl transition duration-300 rounded-xl z-10 text-lg font-bold uppercase flex items-center justify-center h-12"
      }
      style={{
        height: 45,
        boxShadow:
          "0px 0px 30px rgba(16, 185, 129, 0.2), inset 0 -10px 15px 0 rgba(16, 185, 129, 0.4)",
      }}>
      <i className="fas fa-print text-red-400 pr-2"></i>
      Imprimer Commandes
    </button>

    // <a
    //   className="relative w-12 h-12 min-w-12 min-h-12 text-2xl bg-white text-red-500 inline-flex items-center justify-center rounded-full shadow-lg hover:shadow-xl hover:bg-green-100 transition duration-300 cursor-pointer"
    //   onClick={() => handlePrint([])}
    //   target="_blank"
    //   rel="noreferrer">
    //   <i className="fas fa-print"></i>
    // </a>
  );
}
