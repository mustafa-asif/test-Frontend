import { Link } from "react-router-dom";
import { getMostRecentTimestamp } from "../../utils/misc";
import { Card } from "../shared/Card";
import { Copyable } from "../shared/Copyable";
import { HumanDate } from "../shared/HumanDate";
import { JsonViewButton } from "../shared/JsonViewer";
import { ProductsDisplay } from "../shared/ProductsDisplay";
import { StatusView } from "../shared/StatusView";
import { TargetDisplay } from "../shared/TargetDisplay";

export const DoubleTransferCard = ({ order, transfers }) => {
  return (
    <Card>
      <div className="flex flex-col gap-y-2">
        <p className="uppercase font-bold text-gray-400 text-sm">Order</p>
        <div className="grid grid-cols-4 gap-2 border p-3">
          <div className="col-span-4 flex justify-between items-center whitespace-nowrap">
            <div className="flex gap-x-2 items-center">
              <span className="font-light text-gray-400 hover:text-green-500">
                <Copyable text={order._id} />
              </span>
            </div>
            <div className="flex gap-x-1 items-center">
              <span className="text-sm text-light text-gray-400">
                <HumanDate date={getMostRecentTimestamp(order.timestamps)} long />
              </span>

              <Link
                to={`/view/orders/${order._id}`}
                className="ml-2 rounded-full h-6 w-6  flex  items-center text-gray-500 bg-green-100 shadow-sm justify-center cursor-pointer text-xs">
                <i className="fas fa-arrow-right"></i>
              </Link>
              <JsonViewButton model="orders" _id={order._id} />
            </div>
          </div>
          <TargetDisplay target={order.target} status={order.status} />

          {/* warehouse */}
          <ProductsDisplay products={order.products} />
          <StatusView status={order.status} model={"orders"} />
        </div>

        <p className="uppercase font-bold text-gray-400 text-sm">Transfers</p>
        {transfers.map((transfer) => (
          <div className="grid grid-cols-4 gap-2 border p-3">
            <div className="col-span-4 flex items-center justify-between whitespace-nowrap">
              <div className="flex items-center gap-x-2">
                <span className="font-light text-sm text-gray-400 hover:text-green-500">
                  <Copyable text={transfer._id} />
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-light text-sm text-gray-400">
                  <HumanDate date={getMostRecentTimestamp(transfer.timestamps)} long />
                </span>

                <Link
                  to={`/view/transfers/${transfer._id}`}
                  className="ml-2 rounded-full h-6 w-6  flex  items-center text-gray-500 bg-green-100 shadow-sm justify-center cursor-pointer text-xs">
                  <i className="fas fa-arrow-right"></i>
                </Link>
                <JsonViewButton model="transfers" _id={transfer._id} />
              </div>
            </div>

            <ProductsDisplay products={transfer.products} />

            <div className="rounded-full h-10 flex items-center col-span-4 bg-gray-100 shadow-sm justify-center capitalize">
              <span className="text-red-500">{transfer.from_city}</span>
              <i className="fas fa-arrow-right mx-3"></i>
              <span className="text-green-500">{transfer.to_city}</span>
            </div>
            <StatusView status={transfer.status} model={"transfers"} />
          </div>
        ))}
      </div>
    </Card>
  );
};
