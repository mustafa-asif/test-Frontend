import { Fragment, useState } from "react";
import { Pic } from "./Pic";
import { useViewLockedItems } from "../followup/LockedItems";

export const ProductsDisplay = ({
  products = [],
  locked_items = false,
  order_id,
  order_status,
  showRefrs,
}) => {
  const [expanded, setExpanded] = useState(false);
  const viewLockedItems = useViewLockedItems();

  function toggleExpanded() {
    setExpanded(!expanded);
  }

  const visibleLimit = expanded ? products.length + 1 : products.length === 2 ? 2 : 1;
  const long = products.length > 2;
  const even = products.length % 2 === 0;
  const needs_filler = !long && !even;

  return (
    <Fragment>
      {products.slice(0, visibleLimit).map((product, i) => (
        <ProductBadge key={i} {...product} showRefr={showRefrs} />
      ))}{" "}
      {locked_items && (
        <div
          className="cursor-pointer hover:shadow-sm place-self-end h-[20px] w-min text-xs px-[5px] bg-red-50 text-red-500 border border-solid border-red-100 flex items-center justify-center gap-[3px]"
          onClick={() =>
            viewLockedItems({
              id: order_id,
              status: order_status,
              totalItemsRequired: products.reduce((sum, current) => sum + current.quantity, 0),
            })
          }>
          locked_items <i className="fas fa-lock"></i>
        </div>
      )}
      {needs_filler && <div className="col-span-2"></div>}
      {long && (
        <div
          className={`col-span-${
            expanded && even ? "4" : "2"
          } rounded-full h-10 text-lg flex items-center font-bold bg-gray-100 hover:bg-gray-200 shadow-sm hover:shadow-md justify-center transition duration-300 cursor-pointer`}
          onClick={toggleExpanded}>
          <i className={`fas fa-chevron-${expanded ? "up" : "down"}`}></i>
        </div>
      )}
    </Fragment>
  );
};

function ProductBadge({ product, quantity, onClick, showRefr }) {
  return (
    <div
      className={`text-sm font-semibold flex items-center col-span-2 gap-x-[5px] ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={onClick}>
      <Pic
        //image={product?.image}
        jdenticonValue={product?._id}
        radius={4}
        fallback="tag"
      />
      {/* <div className="flex items-center justify-center w-[25px] h-[25px] text-xs bg-black/10 border border-gray-300 text-gray-500 rounded-full">
        <i className="fas fa-tag"></i>
      </div> */}
      <span>{product?.name}</span>
      {showRefr && product?.refr && <span className="text-xs opacity-70">({product.refr})</span>}
      {quantity && (
        <span className="h-6 min-w-6 px-1 rounded-full bg-green-50 text-green-500 border border-solid border-green-100 flex items-center justify-center">
          {quantity}
        </span>
      )}
    </div>
  );
}
