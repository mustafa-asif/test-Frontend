import { Dialog, useMediaQuery } from "@mui/material";
import { Fragment } from "react";
import { IconButton } from "./Button";
import { Pic } from "./Pic";
import { Copyable } from "../shared/Copyable";

export const SeeItemsDialog = ({ items, products, open, onClose }) => {
  const fullScreen = useMediaQuery("(max-width:768px)");

  return (
    <Dialog onClose={onClose} open={open} fullScreen={fullScreen}>
      <IconButton
        icon="times"
        onClick={onClose}
        className="absolute right-5 top-3 md:hidden z-40 text-gray-800"
        iconColor="gray"
      />
      <div className="grid grid-cols-4 gap-x-3 gap-y-3 overflow-y-scroll rounded-md bg-white text-xl p-6">
        <ProductsDisplay products={products} items={items} />
      </div>
    </Dialog>
  );
};

function ProductsDisplay({ products, items }) {
  return products.map(({ product, quantity }) => {
    const relevantItems = items.filter((it) => it.product._id === product._id);
    return (
      <Fragment key={product._id}>
        <div className="rounded-full h-10 text-sm font-semibold flex items-center col-span-4 bg-white border border-solid border-gray-200">
          <Pic image={product.image} className="mr-1" fallback="tag" />
          <span>{product.name}</span>
        </div>

        {relevantItems.map((item) => (
          <div className="rounded-full h-6 p-3 text-sm flex items-center justify-center bg-green-100 text-green-500"
            key={item._id}>
            <Copyable text={item._id} />
          </div>
        ))}
      </Fragment>
    );
  });
}
