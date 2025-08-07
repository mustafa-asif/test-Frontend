import { Dialog, useMediaQuery } from "@mui/material";
import { useContext, useState } from "react";
import { createContext } from "react";
import { useToast } from "../../hooks/useToast";
import { xFetch } from "../../utils/constants";
import { cl } from "../../utils/misc";
import { Button, IconButton, SButton } from "../shared/Button";
import { useConfirmation, useShowItem } from "../shared/ToolsProvider";
import { useStoreState } from "easy-peasy";

const context = createContext({
  viewLockedItems: ({ id, status, totalItemsRequired }) => {},
});

export const LockedItems = ({ children }) => {
  const [items, setItems] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const mainFollowup = useStoreState((state) => state.auth.user.isMainUser);

  const showToast = useToast();
  const showItem = useShowItem();
  const confirmAction = useConfirmation();
  const fullScreen = useMediaQuery("(max-width:768px)");

  function viewLockedItems(data) {
    loadOrderItems(data.id);
    setOrderData(data);
  }


  async function unlockOrder() {
    if (isLoading) return;
    setLoading(true);
    const { error, data } = await xFetch(`/orders/${orderData.id}`, {
      method: "PATCH",
      body: { locked_items: false },
    });
    setLoading(false);
    if (error) return showToast(error, "error");
    if (data) {
      showToast("success", "success");
      onClose();
    }
  }

  async function loadOrderItems(id) {
    const query = [`locked_order._id=${id}`, `_show=_id`];
    setLoading(true);
    const { data, error } = await xFetch(`/items?${query.join("&")}`);
    setLoading(false);
    if (error) {
      return showToast();
    }
    if (data) {
      setItems(data.map((it) => it._id));
    }
  }

  function onClose() {
    setOrderData(null);
    setLoading(false);
    setItems(null);
  }

  async function unlockItem(id) {
    if (isLoading) return;
    const { error, data } = await xFetch(`/items/${id}`, {
      method: "PATCH",
      body: { locked_order_id: "" },
    });
    setLoading(false);
    if (error) return showToast(error, "error");
    if (data) {
      showToast("success", "success");
      setItems(items.filter((it) => it !== id));
    }
  }

  const editable =
    orderData?.status === "draft" &&
    items?.length !== orderData?.totalItemsRequired &&
    mainFollowup;

  return (
    <context.Provider value={{ viewLockedItems }}>
      {children}
      <Dialog onClose={onClose} open={!!orderData} fullScreen={fullScreen}>
        <IconButton
          icon="times"
          onClick={onClose}
          className="absolute right-5 top-3 md:hidden z-40 text-gray-800"
          iconColor="gray"
        />

        <div className="py-2 px-3 w-full flex justify-between">
          <span className="text-lg">{orderData?.id}</span>
        </div>


        {isLoading && (
          <div className="py-2 px-3 w-full flex justify-between">
            <span className="animate-pulse text-green-600 font-semibold">Loading...</span>
          </div>
        )}
        {!isLoading && (!items || items?.length < 1) && (
          <div className="py-2 px-3 w-full">
            <span className="text-gray-600 font-semibold">
              0 items locked for order {orderData?.id}
            </span>
            {orderData?.status === "awaiting transfer" && (
              <div className="text-gray-400 text-xs">
                order is 'awaiting transfer', items may appear later.
              </div>
            )}
          </div>
        )}
        {!isLoading && items?.length > 0 && (
          <div>
            <div className="flex items-center gap-x-3 gap-y-3 overflow-y-scroll rounded-md bg-white text-xl p-3">
              {items.map((id) => (
                <div
                  key={id}
                  className={`rounded-full h-6 p-3 text-sm flex items-center justify-center cursor-default bg-gray-200 text-gray-500 gap-x-[10px] relative`}>
                  <span className="">{id}</span>
                  <div
                    className={cl(
                      "rounded-full bg-blue-500 hover:bg-blue-600 hover:shadow-md text-white cursor-pointer px-[5px] min-h-[20px] flex items-center justify-center mr-[20px]"
                    )}
                    onClick={() => showItem(id)}
                    disabled={isLoading}>
                    view
                  </div>
                  <div
                    className={cl(
                      "rounded-full bg-red-500 hover:bg-red-600 hover:shadow-md text-white cursor-pointer min-w-[20px] min-h-[20px] flex items-center justify-center absolute right-[2px]",
                      { hidden: !editable }
                    )}
                    onClick={() =>
                      confirmAction({
                        title: `Debloquer article ${id}?`,
                        onConfirm: () => unlockItem(id),
                      })
                    }
                    disabled={isLoading}>
                    <span className="pointer-events-none text-xs">&times;</span>
                  </div>
                </div>
              ))}
            </div>
            {!editable && (
              <div className="text-gray-400 text-sm p-3">
                Items not editable because order is status '{orderData?.status}' and/or items are
                satisfied and/or insufficient priviledges
              </div>
            )}

            <div className="py-2 px-3 w-full flex justify-end">
              {/* manual add ? */}
              {/* <IconButton
                icon="print"
                iconColor="red"
                onClick={() => {
                  showPrint(
                    ordersToPrint.map((or) => ({ _id: or.order_id, items: or.items })),
                    { isOrders: true }
                  );
                  onClose();
                }}
              /> */}
            </div>
          </div>
        )}
        {!isLoading && (
          <div className="py-2 px-3 flex justify-center w-[300px] ml-auto">
            <Button
              label="Unlock Item"
              icon="lock-open"
              btnColor="red"
              onClick={() => confirmAction({ title: "Unlock Order?", onConfirm: unlockOrder })}
            />
          </div>
        )}

      </Dialog>
    </context.Provider>
  );
};

export const useViewLockedItems = () => {
  return useContext(context).viewLockedItems;
};
