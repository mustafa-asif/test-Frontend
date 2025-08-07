import { Fragment, useState } from "react";
import { Card } from "../shared/Card";
import { Copyable } from "../shared/Copyable";
import { NumPod } from "../shared/NumPod";
import { Pic } from "../shared/Pic";

export const ProductCard = ({ client, products }) => {
  const [expanded, setExpanded] = useState(false);
  console.log(products);
  return (
    <Card>
      <div className="grid grid-cols-4 gap-2">
        <div
          className="relative rounded-full h-10 flex items-center col-span-4 bg-gray-100 cursor-pointer"
          onClick={() => setExpanded((expanded) => !expanded)}>
          <Pic
            className="mr-3"
            //image={client.brand.image}
            jdenticonValue={client._id}
          />
          <span>{client.brand.name}</span>
          <NumPod className="ml-1" color={"green"}>
            {products.reduce((count, product) => count + getItemsCount(product.items).free, 0)}
          </NumPod>
          <NumPod className="ml-1" color={"yellow"}>
            {products.reduce((count, product) => count + getItemsCount(product.items).hold, 0)}
          </NumPod>
          <i className={`fas fa-chevron-${expanded ? "up" : "down"} absolute right-6`}></i>
        </div>
        {expanded && products.map((product) => <ItemsDisplay key={product._id} {...product} />)}
      </div>
    </Card>
  );
};

function ItemsDisplay({ _id, image, name, items, refr }) {
  const [expanded, setExpanded] = useState(false);

  const { free, hold } = getItemsCount(items);

  return (
    <Fragment>
      <div
        className="relative rounded-full h-8 flex items-center col-span-4 text-sm font-semibold border border-solid border-gray-100 cursor-pointer"
        onClick={() => setExpanded((expanded) => !expanded)}>
        <Pic
          //image={image}
          jdenticonValue={_id}
          radius={4}
          className="mr-3"
          fallback="tag"
        />
        <span className="line-clamp-1">{name}</span>
        {refr && <span className="ml-[5px] opacity-60">({refr})</span>}
        <NumPod className="ml-1" color={"green"}>
          {free}
        </NumPod>
        <NumPod className="ml-1" color={"yellow"}>
          {hold}
        </NumPod>
        <i className={`fas fa-chevron-${expanded ? "up" : "down"} absolute right-3`}></i>
      </div>
      {expanded &&
        items.map((item) => {
          const colors = !isFree(item)
            ? "bg-yellow-50 text-yellow-500 border-yellow-100"
            : "bg-green-50 text-green-500 border-green-100";
          return (
            <div
              key={item._id}
              className={`relative col-span-2 rounded-full text-sm flex items-center justify-center py-0.5 border border-solid ${colors}`}>
              {item.status === "undergoing transfer" && (
                <i className="fas fa-truck absolute left-3 py-1"></i>
              )}
              {item.status === "with deliverer" && (
                <i className="fas fa-motorcycle absolute left-3 py-1"></i>
              )}
              <Copyable text={item._id} />

              {item.replacement_order && <i className="fas fa-undo absolute right-3 py-1"></i>}
            </div>
          );
        })}
    </Fragment>
  );
}

// function countItems(items, status) {
//   const countHold = !["available"].includes(status);
//   return items.reduce((count, item) => {
//     // const isReserved = !!item.reserved_order || !!item.reserved_transfer;
//     const isReserved = false;
//     const isReplaced = item.replacement_order;
//     if (item.status === "available" && !countHold && !isReserved && !isReplaced) count += 1;
//     if ((!["available"].includes(item.status) || isReserved) && (countHold || !isReplaced))
//       count += 1;
//     return count;
//   }, 0);
// }

function getItemsCount(items) {
  const data = { free: 0, hold: 0, other: 0 };
  for (const item of items) {
    if (isFree(item)) {
      data.free += 1;
    } else {
      data.hold += 1;
    }
  }
  return data;
}

function isFree(item) {
  return (
    item.status === "available" && !item.replacement_order
    // &&
    // !item.reserved_order &&
    // !item.reserved_transfer
  );
}
