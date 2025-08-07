import { Dialog } from "@mui/material";
import { useStoreState } from "easy-peasy";
import { useRouteQuery } from "../../hooks/useRouteQuery";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IconButton } from "../shared/Button";
import { useGoBack } from "../shared/LastLocation";
import { ProductsDisplay } from "../shared/ProductsDisplay";
import { useTranslation } from "../../i18n/provider";

export const ReservedItemsDialog = ({ id, ...props }) => {
  const fullScreen = useMediaQuery('(max-width:768px)');
  const city = useRouteQuery("city");
  const { products } = useStoreState((state) => state.products);
  const [reserved, setReserved] = useState({});
  const [withDeliverers, setWithDeliverers] = useState(0);
  const tl = useTranslation();

  const handleDrawerClose = useGoBack("/products");

  useEffect(() => {
    const product = products.find((p) => p._id === id);
    const items = product?.items || [];
    setWithDeliverers(items.filter(item => item.warehouse?.city === city && item.status === "with deliverer" && !item.reserved_order).length);
    setReserved(getReservedPerCity(items, city));
  }, [city]);

  const content = (() => {
    return (
      <Fragment>
        <div className="flex flex-col overflow-y-scroll rounded-md bg-white">
          <div className="flex flex-wrap items-center p-6">
            <ProductsDisplay products={[{ product: products.find((p) => p._id === id) }]} />
            <div className="flex items-center ml-3">
              <span className="font-bold capitalize">{city}</span>
            </div>
          </div>
        </div>
        <table className="items-center w-full bg-transparent border-collapse">
          <thead className="thead-light">
            <tr>
              <th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-md uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                {tl("order") + " / " + tl("transfer")}
              </th>
              <th className="px-6 bg-yellow-50 text-yellow-500 align-middle border border-solid border-yellow-100 py-3 text-md uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
                {tl("reserved")}
              </th>
            </tr>
          </thead>
          <tbody className="text-center">
            {withDeliverers > 0 && (
              <TypeRow key="with deliverers" thingId={tl("with_deliverers")} count={withDeliverers} />
            )}
            {Object.entries(reserved).map((thing) => (
              <TypeRow key={thing[0]} thingId={thing[0]} count={thing[1]} />
            ))}
          </tbody>
        </table>
      </Fragment>
    );
  })();

  return (
    <Dialog {...props} onClose={handleDrawerClose} fullScreen={fullScreen}>
      <IconButton
        icon="times"
        onClick={handleDrawerClose}
        className="absolute right-5 top-3 md:hidden z-40 text-gray-800"
        iconColor="gray"
      />
      {content}
    </Dialog>
  );
};

function getReservedPerCity(items, city) {
  let reserved = {};
  items = items.filter(item => item.warehouse?.city === city);
  for (const item of items) {
    if (item.reserved_order) {
      reserved[item.reserved_order._id] ??= 0;
      reserved[item.reserved_order._id] += 1;
    } else if (item.reserved_transfer) {
      reserved[item.reserved_transfer._id] ??= 0;
      reserved[item.reserved_transfer._id] += 1;
    }
  }
  return reserved;
}

function TypeRow({ thingId, count }) {
  return (
    <tr>
      <th className="border-t-0 px-6 border-l-0 border-r-0 text-xl whitespace-nowrap p-4 text-left align-middle">
        <Link to={`/view/${thingId.startsWith("or") ? "orders" : thingId.startsWith("tr") ? "transfers" : "#"}/${thingId}`}>
          {thingId}
        </Link>
      </th>
      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xl whitespace-nowrap p-4">
        {count}
      </td>
    </tr>
  );
}