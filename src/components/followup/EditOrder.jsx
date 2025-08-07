import { Fragment, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { useTranslation } from "../../i18n/provider";
import { getDifferences } from "../../utils/misc";
import { xEditOrder } from "../../utils/orders";
import { Label } from "../shared/Label";
import { Button, IconButton } from "../shared/Button";
import { CityCombobox } from "../shared/CityCombobox";
import { FormDatePicker } from "../shared/FormDatePicker";
import { Checkbox, Input } from "../shared/Input";
import { ProductsCombobox } from "../shared/ProductsCombobox";
import orderTraceService from "../../services/OrderTraceService";
import { useStoreState } from "easy-peasy";
import HiddenPhone from "../shared/HiddenPhone";

export const EditOrder = ({ document: order, handleDrawerClose, ...props }) => {
  const user = useStoreState((state) => state.auth.user);
  const original_doc = getEditableOrder(order);
  const [fields, setFields] = useState(original_doc);
  const [isLoading, setLoading] = useState(false);

  const showToast = useToast();
  const tl = useTranslation();
  // const limited = order.status !== "draft";
  const limited = order.locked_items;

  async function handleSave(e) {
    e.preventDefault();
    const changes = getDifferences(original_doc, fields);
    console.log("changes ", changes);
    setLoading(true);

    await orderTraceService.traceOrderChange(
      order._id,
      "[FollowupDashboard.EditOrder]:: Order changed",
      { status: order.status, target: order.target, cost: order.cost },
      changes,
      user
    );

    const { error } = await xEditOrder(order._id, changes);
    setLoading(false);
    if (error) {
      return showToast(error, "error");
    }
    return showToast("success", "success");
  }

  return (
    <Fragment>
      <div className="mb-6">
        <IconButton icon="arrow-left" className="mr-2" onClick={handleDrawerClose} />
        <span className="text-gray-700 text-lg md:text-2xl uppercase font-semibold">
          {tl("edit_order")} <span className="lowercase text-gray-500">{order._id}</span>
        </span>
      </div>
      <div className="pb-10">
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 grid-flow-row-dense">
            {/*  */}
            <div className="col-span-2">
              <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                {tl("products")}
              </label>
              <ProductsCombobox
                client_id={order.client._id}
                value={fields.products}
                onValueChange={(products) => setFields({ ...fields, products })}
                query={{ order_city: fields.target.city }}
                disabled={limited || isLoading}
              />
            </div>
            {/*  */}
            {/*  */}
            <div>
              <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                {tl("cost")}
              </label>
              <Input
                type="tel"
                pattern="[0-9]*"
                value={fields.cost}
                onChange={(e) => {
                  if (!e.target.validity.valid && !!e.target.value) return;
                  setFields({
                    ...fields,
                    cost: e.target.value,
                  });
                }}
                disabled={isLoading}
                required
              />
            </div>
            <div></div>
            {/*  */}
            {/*  */}
            <div>
              <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                {tl("name")}
              </label>
              <Input
                value={fields.target.name}
                onValueChange={(name) =>
                  setFields({ ...fields, target: { ...fields.target, name } })
                }
                disabled={isLoading}
                required
              />
            </div>
            {/*  */}
            {/*  */}
            <div>
              <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                {tl("phone")}
              </label>
              <HiddenPhone
                phone={fields.target.phone}
                metadata={{ order_id: order._id, order_status: order.status }}
                onEdit={(phone) => setFields({ ...fields, target: { ...fields.target, phone } })}
              />
            </div>
            {/*  */}
            {/*  */}
            <div>
              <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                {tl("city")}
              </label>
              <CityCombobox
                value={fields.target.city}
                onValueChange={(city) =>
                  setFields({ ...fields, target: { ...fields.target, city } })
                }
                disabled={isLoading}
                required
              />
            </div>
            {/*  */}
            {/*  */}
            <div>
              <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                {tl("address")}
              </label>
              <Input
                value={fields.target.address}
                onValueChange={(address) =>
                  setFields({ ...fields, target: { ...fields.target, address } })
                }
                disabled={isLoading}
                required
              />
            </div>
            {/*  */}
            {/*  */}
            <div>
              <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                {tl("desired_date") + " (" + tl("optional") + ")"}
              </label>
              <FormDatePicker
                value={fields.desired_date}
                onValueChange={(desired_date) => setFields({ ...fields, desired_date })}
                disabled={limited || isLoading}
              />
            </div>
            {/*  */}
            <div className="col-span-2 flex items-center gap-x-3"></div>
            {/*  */}
            <div className="col-span-2 flex items-center gap-x-3">
              <Checkbox
                value={fields.variableProducts}
                onValueChange={(variableProducts) => setFields({ ...fields, variableProducts })}
              />
              <Label text={"Variable Products"} className="" />
            </div>
            {/*  */}
            <div className="mt-5 col-span-2 flex flex-col gap-y-2">
              <Button
                label={tl("save_changes")}
                btnColor="secondary"
                type="button"
                isLoading={isLoading}
                onClick={handleSave}
              />
            </div>
            {/*  */}
          </div>
        </form>
      </div>
    </Fragment>
  );
};

function getEditableOrder(order) {
  return {
    cost: order.cost,
    desired_date: order.desired_date,
    variableProducts: order.variableProducts,
    products: order.products.map(({ product, quantity }) => ({
      product_id: product._id,
      quantity,
    })),
    target: {
      name: order.target.name,
      phone: order.target.phone,
      city: order.target.city,
      address: order.target.address,
    },
  };
}
