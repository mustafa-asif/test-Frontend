import { Drawer, Menu, MenuItem } from "@mui/material";
import printJS from "print-js";
import { Fragment, useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { useTranslation } from "../../i18n/provider";
import { xFetch } from "../../utils/constants";
import { cl } from "../../utils/misc";
import { AltButton, Button, IconButton } from "./Button";

export const PrintComponent = ({ state, isOpen, onClose }) => {
  const { items, onPrint } = state;
  const [slots, setSlots] = useState(items);
  const [gridType, setGridType] = useState("a4");
  const unusedItems = items.filter((item) => !slots.some((it) => it?._id === item._id));
  const tl = useTranslation();

  useEffect(() => {
    setSlots(items);
  }, [items]);

  return (
    <Drawer open={isOpen} anchor="bottom" onClose={onClose}>
      <div className=" h-full p-5">
        {/*  */}
        <div className="mb-6">
          {/* @ts-ignore */}
          <IconButton icon="times" className="mr-2" onClick={onClose} />
          <span className="text-gray-700 text-lg md:text-2xl uppercase font-semibold">
            {tl("print_labels")}
          </span>
        </div>
        {/*  */}
        <div className="flex flex-col gap-y-3">
          {/*  */}
          <ActionBar
            slots={slots}
            setSlots={setSlots}
            gridType={gridType}
            setGridType={setGridType}
            onPrint={onPrint}
            onClose={onClose}
            isOrders={state.isOrders}
            isContainer={state.isContainer}
          />
          {/*  */}
          {unusedItems.length > 0 && <UnusedItems items={unusedItems} setSlots={setSlots} />}
          {/*  */}
          <SlotsDisplay slots={slots} setSlots={setSlots} gridType={gridType} />
          {/*  */}
        </div>
        {/*  */}
      </div>
    </Drawer>
  );
};

function ActionBar({
  setSlots,
  onPrint,
  onClose,
  slots,
  isOrders,
  isContainer,
  gridType,
  setGridType,
}) {
  const showToast = useToast();
  const tl = useTranslation();

  const [isLoading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  function addEmpty() {
    setSlots((slots) => [null, ...slots]);
  }

  async function handlePrint() {
    if (isLoading) return;
    setLoading(true);
    await printItemsQr(slots);
    setLoading(false);
    onPrint?.();
    onClose?.();
  }

  async function printItemsQr(rawSlots) {
    const path = !isOrders ? "/print/stickers" : "/print/orders";
    const slots = !isOrders
      ? rawSlots.map((slot) => slot?._id || slot)
      : rawSlots.map((slot) => (slot ? { order_id: slot._id, items: slot.items } : slot));

    const body = { slots };
    // include gridType with orders
    if (isOrders) body["gridType"] = gridType;
    if (isContainer) body["variant"] = "container";

    const { data, error } = await xFetch(path, {
      method: "POST",
      body,
    });
    if (error) return showToast(error, "error");

    if (data.type === "html") {
      return printJS({ type: "raw-html", printable: data.data });
    } else if (data.type === "pdf") {
      showToast("opening pdf in new tab...");
      const blob = new Blob([base64ToArrayBuffer(data.data)], { type: "application/pdf" });
      window.open(URL.createObjectURL(blob), "_blank");
    } else {
      showToast("Unknown type", "error");
    }
  }

  return (
    <div className="grid grid-cols-3 gap-x-3 mb-4">
      <Button icon="plus" btnColor="primary" label={tl("add_empty")} onClick={addEmpty} />
      <div>
        <Button
          icon="cog"
          btnColor="secondary"
          disabled={!isOrders || isLoading}
          onClick={(e) => setAnchorEl(e.currentTarget)}>
          <div className="mx-1">
            <span>Grid Type:</span>{" "}
            <span className="text-gray-700 capitalize">{isOrders ? gridType : "a4"}</span>
          </div>
        </Button>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}>
          <MenuItem
            disabled={gridType === "a4"}
            onClick={() => {
              setGridType("a4");
              setAnchorEl(null);
            }}>
            A4 (210mm x 297mm)
          </MenuItem>
          <MenuItem
            disabled={gridType === "4x4"}
            onClick={() => {
              setGridType("4x4");
              setAnchorEl(null);
            }}>
            4x4 (16cm x 16cm)
          </MenuItem>
          <MenuItem
            disabled={gridType === "single"}
            onClick={() => {
              setGridType("single");
              setAnchorEl(null);
            }}>
            Single (8cm x 8cm)
          </MenuItem>
        </Menu>
      </div>
      <Button
        icon="print"
        btnColor="gray"
        label={!isOrders ? tl("print_labels") : tl("print_orders")}
        onClick={handlePrint}
        isLoading={isLoading}
      />
    </div>
  );
}

function UnusedItems({ items, setSlots }) {
  const tl = useTranslation();
  function appendItem(item) {
    setSlots((slots) => [...slots, item]);
  }

  return (
    <div className="flex gap-x-1 items-center">
      <p className="text-gray-600">{tl("unused_items")}:</p>
      <div className="flex-1 flex gap-1 bg-gray-100 p-2">
        {items.map((item) => (
          <AltButton key={item._id} label={item._id} onClick={() => appendItem(item)} />
        ))}
      </div>
    </div>
  );
}

function SlotsDisplay({ slots, setSlots, gridType }) {
  const maxNum = gridType === "single" ? 8 : gridType === "4x4" ? 16 : 21;
  const extraSpace =
    slots.length <= maxNum ? maxNum - slots.length : maxNum - (slots.length % maxNum);
  return (
    <div
      className={cl(
        "grid gap-2",
        { "grid-cols-3": gridType === "a4" },
        { "grid-cols-2": gridType === "4x4" },
        { "grid-cols-1": gridType === "single" }
      )}>
      {slots.map((item, i) => (
        <Fragment key={item?._id + "_" + i}>
          <SlotItem item={item} setSlots={setSlots} />
          {(i + 1) % maxNum === 0 && (
            <Fragment>
              {[...Array(3)].map((_, i) => (
                <div key={"page_space" + i} className="mb-3"></div>
              ))}
            </Fragment>
          )}
        </Fragment>
      ))}
      {[...Array(extraSpace)].map((_, i) => (
        <div className="bg-gray-100 rounded-md h-10" key={`page_rest-` + i}></div>
      ))}
    </div>
  );
}

function SlotItem({ item, setSlots }) {
  const tl = useTranslation();
  const isFiller = !item;
  function removeSlot() {
    if (isFiller) return setSlots((slots) => slots.slice(1));
    else setSlots((slots) => slots.filter((slot) => slot?._id !== item._id));
  }

  return (
    <div
      className={`${
        isFiller ? "bg-gray-200" : "bg-blue-200"
      } flex items-center justify-center rounded-md relative h-10`}>
      {isFiller ? tl("empty") : item._id}
      <span
        className="bg-red-400 hover:bg-red-500 absolute -top-1 -right-1 flex items-center justify-center rounded-full w-4 h-4 cursor-pointer shadow-sm hover:shadow-md"
        onClick={removeSlot}>
        <i className="fas fa-times text-white text-xs"></i>
      </span>
    </div>
  );
}

function base64ToArrayBuffer(base64) {
  var binaryString = window.atob(base64);
  var binaryLen = binaryString.length;
  var bytes = new Uint8Array(binaryLen);
  for (var i = 0; i < binaryLen; i++) {
    var ascii = binaryString.charCodeAt(i);
    bytes[i] = ascii;
  }
  return bytes;
}
