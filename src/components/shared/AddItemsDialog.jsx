import { Dialog } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Fragment, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { useTranslation } from "../../i18n/provider";
import { Button, IconButton } from "./Button";
import { Pic } from "./Pic";
import { useConfirmation, useScan } from "./ToolsProvider";
import { usePlaySound } from "../../sounds/Sounds";
import { useStoreState } from "easy-peasy";
import { xFetch } from "../../utils/constants";
import { getIDModelName } from "../../utils/misc";


export const AddItemsDialog = ({ isOpen, state, setItems, setOpen }) => {
  const user = useStoreState((state) => state.auth.user);
  const promptAction = useConfirmation();
  const tl = useTranslation();
  const [isLoading, setLoading] = useState(false);
  const [suggestedItems, setSuggestedItems] = useState(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const playSound = usePlaySound();
  const showToast = useToast();
  const fullScreen = useMediaQuery("(max-width:768px)");
  state.fetchDocument ||= true;

  const showChargerSuggestions = state.products.some(({product}) => product.refr && product.refr.trim() !== '');

  const showScan = useScan({
    fetchDocument: state.fetchDocument,
    onData: handleData,
    allowedModels: ["items", "orders"],
  });

  function handleClose() {
    setOpen(false);
    setLoading(false);
    setItems((items) => []);
    setSuggestedItems(null);
    setLoadingSuggestions(false);
  }

  function handleData(data) {
    const model = getIDModelName(data._id);
    if (model === "items") return handleItem(data);
    if (model === "orders") return handleOrder(data._id);
  }

  function handleFinish() {
    console.log(state);
    if (isLoading || !state.items.length) return;
    if (state.expected_items_count && state.expected_items_count !== state.items.length) {
      return promptAction({
        onConfirm: () => actuallyHandleFinish({ confirm_text: "items_miscount" }),
        title: tl("expected_x_received_y", {
          expected: state.expected_items_count,
          received: state.items.length,
        }),
      });
    }
    if (state.items.length > 1 || user.role !== "deliverer") return actuallyHandleFinish();
    else
      promptAction({
        onConfirm: actuallyHandleFinish,
        title: tl("all items scanned?"),
      });
  }

  async function actuallyHandleFinish(extra_args = {}) {
    setLoading(true);
    const suceeded = await state.onFinish?.(state.items, extra_args);
    setLoading(false);
    if (suceeded) {
      playSound("done");
      handleClose();
    }
  }

  function handleItem(item) {
    if (!state.fetchDocument) {
      setItems((items) => {
        const isDuplicate = items.some((it) => it._id === item);
        if (isDuplicate) return items;
        return [...items, { _id: item }];
      });
    } else {
      setItems((items) => {
        const isDuplicate = items.some((it) => it._id === item._id);
        if (isDuplicate) return items;
        return [...items, { _id: item._id, product: { _id: item.product._id } }];
      });
    }
  }

  async function handleOrder(id) {
    setLoading(true);
    const { data, error } = await xFetch(
      `/items?locked_order._id=${id}&skipFilters=true&_show=product`
    );
    setLoading(false);
    if (error) return showToast(error, "error");
    if (data.length === 0) return showToast("aucun article trouvé pour commande", "error");
    showToast(`${data.length} articles trouvés`);
    for (const item of data) {
      handleItem(item);
    }
  }

  function skipFinish() {
    setOpen(false);
    state.onFinish?.(undefined);
  }

  function promptRemove(id) {
    promptAction({
      title: "Supprimer l'article",
      onConfirm: () => setItems((items) => items.filter((item) => item._id !== id)),
    });
  }
  async function loadSuggestedItems() {
    if (loadingSuggestions) return;
    const query = ["_show=_id"];
    if (state.hint?.transfer_id) query.push(`reserved_transfer._id=${state.hint.transfer_id}`);
    if (state.hint?.order_id) query.push(`reserved_order._id=${state.hint.order_id}`);
    if (query.length === 1) return;
    setLoading(true);
    const { data, error } = await xFetch(`/items?${query.join("&")}`);
    setLoading(false);
    if (error) return showToast(error, "error");
    if (data) setSuggestedItems(data.map((it) => it._id));
  }

  return (
    <Dialog onClose={handleClose} open={isOpen} fullScreen={fullScreen}>
      <div className="grid grid-cols-4 gap-x-3 gap-y-3 overflow-y-scroll rounded-md bg-white text-xl p-6">
        <div className="flex col-span-4 gap-x-2">
          <Button
            icon="qrcode"
            btnColor="secondary"
            className="px-6"
            label={tl("add_item")}
            onClick={showScan}
            disabled={isLoading}
          />
          {state.city && (
            <div className="relative flex-1 rounded-full whitespace-nowrap px-2 h-12 flex items-center bg-gray-100 text-red-500 shadow-sm justify-center capitalize cursor-pointer">
              {state.city}
            </div>
          )}
          <IconButton
            icon="times"
            onClick={handleClose}
            className="md:hidden z-40 text-gray-800"
            iconColor="gray"
          />
        </div>

        {state.products?.length > 0 && (
          <ProductsDisplay
            products={state.products}
            items={state.items}
            promptRemove={promptRemove}
          />
        )}
        {(!state.products || state.products?.length < 1) && (
          <ItemsDisplay items={state.items} promptRemove={promptRemove} />
        )}
        {(state.hint?.transfer_id || state.hint?.order_id) && (
          <div className="col-span-4 mt-2 py-1 border-t">
            {!loadingSuggestions && !suggestedItems && showChargerSuggestions && (
              <button
                className="text-blue-500 hover:text-blue-600 hover:underline text-sm"
                onClick={loadSuggestedItems}>
                Charger Suggestions
              </button>
            )}
            {loadingSuggestions && <p className="text-sm animate-pulse">Loading...</p>}
            {!loadingSuggestions && suggestedItems?.length > 0 && (
              <div className="flex gap-[5px]">
                {suggestedItems
                  .filter((id) => !state.items.some((it) => it._id === id))
                  .map((item) => (
                    <div
                      className={`rounded-full h-6 flex items-center justify-between px-2 bg-blue-300 text-sm`}
                      key={item}>
                      <span>{item}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        <div className="col-span-4 mt-2">
          {state.items.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              <div className="rounded-full text-lg flex items-center col-span-1 font-bold bg-green-50 text-green-500 border border-solid border-green-100 justify-center">
                {state.items.length}
              </div>
              <Button
                className="col-span-3"
                disabled={state.items.length < 1}
                icon="check"
                label={tl("fulfilled")}
                onClick={handleFinish}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>
        {state.optional && (
          <div className="col-span-4">
            <Button icon="step-forward" label="Skip" onClick={skipFinish} />
          </div>
        )}
      </div>
    </Dialog>
  );
};

function ProductsDisplay({ products, items, promptRemove }) {
  const rogueItems = items.filter(
    (item) => !products.some((pr) => pr.product._id === item.product._id)
  );
  return (
    <Fragment>
      {products.map(({ product, quantity }) => {
        const relevantItems = items.filter((it) => it.product._id === product._id);
        return (
          <Fragment key={product._id}>
            <div className="rounded-full h-10 text-sm font-semibold flex items-center col-span-3 bg-white border border-solid border-gray-200">
              <Pic image={product.image} className="mr-1" fallback="tag" />
              <span>{product.name}</span>
            </div>
            <div className="rounded-full h-10 font-bold text-white flex items-center justify-center col-span-1 bg-blue-500">
              {quantity - relevantItems.length}
            </div>
            {relevantItems.map((item) => (
              <div
                className={`rounded-full h-8 flex items-center justify-between pl-3 pr-1 col-span-2 text-white bg-gray-700 ${
                  !!promptRemove ? "cursor-pointer hover:bg-gray-600" : ""
                }`}
                onClick={() => promptRemove?.(item._id)}
                key={item._id}>
                <span>{item._id}</span>
                <i className="fa fa-times-circle pl-1 text-gray-500 hover:text-gray-400"></i>
              </div>
            ))}
          </Fragment>
        );
      })}
      {rogueItems.length > 0 && (
        <Fragment>
          <div className="rounded-full h-10 text-sm font-semibold flex items-center col-span-3 bg-white border border-solid border-gray-200">
            <Pic className="mr-1" fallback="tag" />
            <span>Unknown</span>
          </div>
          <div className="rounded-full h-10 font-bold text-white flex items-center justify-center col-span-1 bg-blue-500">
            {rogueItems.length}
          </div>
          {rogueItems.map((item) => (
            <div
              className={`rounded-full h-8 flex items-center justify-between pl-3 pr-1 col-span-2 text-white bg-gray-700 ${
                !!promptRemove ? "cursor-pointer hover:bg-gray-600" : ""
              }`}
              onClick={() => promptRemove?.(item._id)}
              key={item._id}>
              <span>{item._id}</span>
              <i className="fa fa-times-circle pl-1 text-gray-500 hover:text-gray-400"></i>
            </div>
          ))}
        </Fragment>
      )}
    </Fragment>
  );
}

function ItemsDisplay({ items, promptRemove }) {
  const tl = useTranslation();
  return (
    <Fragment>
      {items.map((item) => (
        <div
          className={`rounded-full h-8 flex items-center justify-between pl-3 pr-1 col-span-2 text-white bg-gray-700 ${
            !!promptRemove ? "cursor-pointer hover:bg-gray-600" : ""
          }`}
          onClick={() => promptRemove?.(item._id)}
          key={item._id}>
          <span>{item._id}</span>
          <i className="fa fa-times-circle pl-1 text-gray-500 hover:text-gray-400"></i>
        </div>
      ))}
      {items.length < 1 && (
        <div className="col-span-4 text-center pt-2 text-gray-400">{tl("no_items")}</div>
      )}
    </Fragment>
  );
}
