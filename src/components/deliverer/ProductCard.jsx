import { Fragment, useState } from "react";
import { Card } from "../shared/Card";
import { Copyable } from "../shared/Copyable";
import { NumPod } from "../shared/NumPod";
import { Pic } from "../shared/Pic";

export const ProductCard = ({ client, products }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <div className="grid grid-cols-4 gap-2">
        <div
          className="relative rounded-full h-10 flex items-center col-span-4 bg-gray-100 cursor-pointer"
          onClick={() => setExpanded((expanded) => !expanded)}>
          <Pic className="mr-3" image={client.brand.image} />
          <span>{client.brand.name}</span>
          <NumPod className="ml-1" color={"green"}>
            {products.reduce((count, product) => count + countItems(product.items).free, 0)}
          </NumPod>
          <NumPod className="ml-1" color={"yellow"}>
            {products.reduce((count, product) => count + countItems(product.items).hold, 0)}
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

  const { hold, free } = countItems(items);
  return (
    <Fragment>
      <div
        className="relative rounded-full h-8 flex items-center col-span-4 text-sm font-semibold border border-solid border-gray-100 cursor-pointer"
        onClick={() => setExpanded((expanded) => !expanded)}>
        <Pic jdenticonValue={_id} radius={4} className="mr-3" fallback="tag" />
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
          const colors = isOnHold(item)
            ? "bg-yellow-50 text-yellow-500 border-yellow-100"
            : "bg-green-50 text-green-500 border-green-100";
          return (
            <Copyable
              key={item._id}
              className={`col-span-2 rounded-full text-center py-0.5 border border-solid ${colors}`}
              text={item._id}
            />
            // </div>
          );
        })}
    </Fragment>
  );
}

function countItems(items) {
  const count = { free: 0, hold: 0 };

  for (const item of items) {
    if (isOnHold(item)) {
      count.hold += 1;
      continue;
    }
    count.free += 1;
  }

  return count;
}

function isOnHold(item) {
  return item.status !== "with deliverer" || !!item.reserved_transfer || !!item.reserved_order;
}
