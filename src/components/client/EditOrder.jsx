import { Fragment, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { useTranslation } from "../../i18n/provider";
import { getDifferences } from "../../utils/misc";
import { xEditOrder } from "../../utils/orders";
import { Button, IconButton } from "../shared/Button";
import { CityCombobox } from "../shared/CityCombobox";
import { FormDatePicker } from "../shared/FormDatePicker";
import { Checkbox, Input } from "../shared/Input";
import { Label } from "../shared/Label";
import { ProductsCombobox } from "../shared/ProductsCombobox";
import { useConfirmation } from "../shared/ToolsProvider";
import { useStoreState } from "easy-peasy";
import orderTraceService from "../../services/OrderTraceService";
import HiddenPhone from "../shared/HiddenPhone";

export const EditOrder = ({ document: order, handleDrawerClose, ...props }) => {
  const user = useStoreState((state) => state.auth.user);
  const original_doc = getEditableOrder(order);
  const [fields, setFields] = useState(original_doc);
  const [isLoading, setLoading] = useState(false);

  const showToast = useToast();
  const confirmAction = useConfirmation();
  const tl = useTranslation();

  async function handleSave(e, extra_args = {}) {
    e?.preventDefault();
    const changes = getDifferences(original_doc, fields);
    setLoading(true);

    await orderTraceService.traceOrderChange(
      order._id,
      "[ClientDashboard.EditOrder]:: Order changed",
      { status: order.status, target: order.target, cost: order.cost },
      changes,
      user
    );

    const { error, ...rest } = await xEditOrder(order._id, { ...changes, ...extra_args });
    setLoading(false);

    if (error) {
      const { error_type, error_details } = rest;

      if (error_type === "prompt") {
        showToast(error, "warning");
        return confirmAction({
          title: `${tl("use")} ${fields.target.phone}?`,
          onConfirm: () => handleSave(null, { confirm_text: error_details.confirm_text }),
        });
      }

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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/*  */}
            <div className="col-span-2">
              <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                {tl("city")}
              </label>
              <CityCombobox
                value={fields.target.city}
                onValueChange={(city) =>
                  setFields({ ...fields, target: { ...fields.target, city } })
                }
                showComments
                disabled={isLoading || order.locked_items}
                required
              />
            </div>
            {/*  */}
            {/*  */}
            <div className="col-span-2">
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
            <div className={!fields.target.city ? "hidden" : "col-span-2 md:col-span-4"}>
              <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                {order.locked_items ? "Référence" : tl("products")}
              </label>
              <ProductsCombobox
                value={fields.products}
                onValueChange={(products) => setFields({ ...fields, products })}
                query={{ order_city: fields.target.city }}
                disabled={isLoading || order.locked_items}
                lockedOrder={order.locked_items}
              />
            </div>
            {/*  */}
            {/*  */}
            <div className="col-span-2">
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
            <div className="col-span-2">
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
            <div className="col-span-2">
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
            {/*  */}
            {/*  */}
            <div className="col-span-2">
              <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                {tl("desired_date") + " (" + tl("optional") + ")"}
              </label>
              <FormDatePicker
                value={fields.desired_date}
                onValueChange={(desired_date) => setFields({ ...fields, desired_date })}
                disabled={isLoading}
              />
            </div>
            {/*  */}
            {/*  */}
            <div className="mt-5 col-span-2 md:col-span-4">
              <Button
                label={tl("save_changes")}
                type="button"
                btnColor="secondary"
                icon="save"
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
