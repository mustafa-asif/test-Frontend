import { Fragment } from "react";
import { Link } from "react-router-dom";
import { getMostRecentTimestamp } from "../../utils/misc";
import { ActionsMenu } from "./ActionsMenu";
import { Card } from "./Card";
import { Copyable } from "./Copyable";
import { CostDisplay } from "./CostDisplay";
import { HumanDate } from "./HumanDate";
import { PackagingSelect } from "./PackagingSelect";
import { ProductsDisplay } from "./ProductsDisplay";
import { TargetDisplay } from "./TargetDisplay";
import { Whatsapp } from "./Whatsapp";

export const PreviewCard = ({ model, ...props }) => {
  switch (model) {
    case "orders":
      return <OrderCard {...props} />;
    case "pickups":
      return <PickupCard {...props} />;
    case "transfers":
      return <TransferCard {...props} />;

    default:
      return () => <div>unexpected model {model}</div>;
  }
};

const OrderCard = ({
  _id,
  cost,
  target,
  products,
  status,
  desired_date,
  timestamps,
  timeline,
  messages,
}) => {
  return (
    <Card>
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-full text-sm font-light text-gray-400 hover:text-green-500 flex items-center col-span-2 -mt-1 cursor-pointer">
          <Copyable text={_id} />
        </div>
        <div className="rounded-full text-sm font-light text-gray-400 flex items-center col-span-2 justify-end -mt-1">
          <HumanDate date={getMostRecentTimestamp(timestamps)} long />
        </div>

        <TargetDisplay target={target} status={status} />

        <ProductsDisplay products={products} />

        <CostDisplay cost={cost} />

        <ActionsMenu _id={_id} model="orders" status={status} history={false} />
      </div>
    </Card>
  );
};

const PickupCard = ({
  _id,
  timestamps,
  type,
  target,
  products,
  messages,
  desired_date,
  timeline,
  status,
  warehouse,
  needs_packaging,
  packaging_type,
  items_count,
}) => {
  const sum = products?.reduce((count, product) => count + product.quantity, 0) || 0;

  return (
    <Card>
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-full text-sm font-light text-gray-400 hover:text-green-500 flex items-center col-span-2 -mt-1 cursor-pointer">
          <Copyable text={_id} />
        </div>
        <div className="rounded-full text-sm font-light text-gray-400 flex items-center col-span-2 justify-end -mt-1">
          <HumanDate date={getMostRecentTimestamp(timestamps)} long />
        </div>
        {target && <TargetDisplay target={target} status={status} />}
        {type === "free" && warehouse && (
          <Fragment>
            <Whatsapp number={"03030300303"} label="Warehouse" />
            <div className="rounded-full h-10 flex items-center col-span-2">
              <i className="fas fa-city pr-1"></i>
              <span className="line-clamp-2 capitalize">{warehouse.city}</span>
            </div>
          </Fragment>
        )}

        <ProductsDisplay products={products} />
        {needs_packaging && <PackagingSelect value={packaging_type} disabled />}
        {["fulfilled", "fulfilling"].includes(status) ? (
          <div className="rounded-full h-10 text-lg flex items-center col-span-1 font-bold bg-green-50 text-green-500 border border-solid border-green-100 justify-center">
            {sum ? sum : items_count ? `${items_count}` : "?"}
          </div>
        ) : (
          <div className="rounded-full h-10 text-lg flex items-center col-span-1 font-bold bg-yellow-50 text-yellow-500 border border-solid border-yellow-100 justify-center">
            {items_count ?? "?"}
          </div>
        )}
        <ActionsMenu _id={_id} model="pickups" status={status} history={false} />
      </div>
    </Card>
  );
};

const TransferCard = ({
  _id,
  timestamps,
  products,
  from_city,
  to_city,
  messages,
  order,
  status,
}) => {
  return (
    <Card>
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-full text-sm font-light text-gray-400 hover:text-green-500 flex items-center col-span-2 -mt-1 cursor-pointer">
          <Copyable text={_id} />
        </div>
        <div className="rounded-full text-sm font-light text-gray-400 flex items-center col-span-2 justify-end -mt-1">
          <HumanDate date={getMostRecentTimestamp(timestamps)} long />
        </div>

        <ProductsDisplay products={products} />

        <div className="rounded-full h-10 flex items-center col-span-4 bg-gray-100 shadow-sm justify-center capitalize">
          <span className="text-red-500">{from_city}</span>
          <i className="fas fa-arrow-right mx-3"></i>
          <span className="text-green-500">{to_city}</span>
        </div>

        {order && (
          <Link
            to={`/view/orders/${order._id}`}
            className="rounded-full h-10 flex col-span-2 items-center text-gray-500 bg-yellow-100 shadow-sm justify-center capitalize cursor-pointer">
            <i className="fas fa-motorcycle"></i>
          </Link>
        )}

        <ActionsMenu _id={_id} model="transfers" status={status} history={false} />
      </div>
    </Card>
  );
};
