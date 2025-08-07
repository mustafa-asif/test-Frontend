import { Fragment, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { CityCombobox } from "../shared/CityCombobox";
import { xAddOrder } from "../../utils/orders";
import { Button, IconButton } from "../shared/Button";
import { Input } from "../shared/Input";
import { ProductsCombobox } from "../shared/ProductsCombobox";
import { useStoreState } from "easy-peasy";
import { useTranslation } from "../../i18n/provider";
import { useConfirmation } from "../shared/ToolsProvider";

export const ReplaceOrder = ({ document: order, handleDrawerClose, ...props }) => {
  const [fields, setFields] = useState({
    cost: 0,
    variableProducts: order.variableProducts,
    // products: [],
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
    replacing_order_id: order._id,
  });

  const [isLoading, setLoading] = useState(false);

  const showToast = useToast();
  const confirmAction = useConfirmation();
  const tl = useTranslation();

  const client_lock_items = useStoreState((state) => state.auth.user.client.lock_items);

  async function handleSend(e, extra_args = {}) {
    e?.preventDefault();
    setLoading(true);
    const { data, error, ...rest } = await xAddOrder({
      ...fields,
      ...extra_args,
      status: "pending",
    });
    setLoading(false);

    if (error) {
      const { error_type, error_details } = rest;

      if (error_type === "prompt") {
        showToast(error, "warning");
        return confirmAction({
          title: `${tl("use")} ${fields.target.phone}?`,
          onConfirm: () => handleSend(null, { confirm_text: error_details.confirm_text }),
        });
      }

      return showToast(error, "error");
    }

    showToast("Success", "success");
    handleDrawerClose();
  }

  return (
    <Fragment>
      <div className="mb-6">
        <IconButton icon="arrow-left" className="mr-2" onClick={handleDrawerClose} />
        <span className="text-gray-700 text-lg md:text-2xl uppercase font-semibold">
          {tl("Remplacer Commande")} <span className="lowercase text-gray-500">{order._id}</span>
        </span>
      </div>
      <div className="pb-10">
        <form onSubmit={handleSend}>
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
                disabled={!!isLoading}
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
                disabled={!!isLoading}
                required
              />
            </div>
            {/*  */}
            {/*  */}
            <div className={!fields.target.city ? "hidden" : "col-span-2 md:col-span-4"}>
              <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                {client_lock_items ? "Référence" : tl("products")}
              </label>
              <ProductsCombobox
                value={fields.products}
                onValueChange={(products) => setFields({ ...fields, products })}
                query={{ order_city: fields.target.city }}
                disabled={!!isLoading}
                lockedOrder={client_lock_items}
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
                disabled={!!isLoading}
                required
              />
            </div>
            {/*  */}
            {/*  */}
            <div className="col-span-2">
              <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                {tl("phone")}
              </label>
              <Input
                type="tel"
                pattern="[0-9]*"
                value={fields.target.phone}
                onChange={(e) => {
                  if (e.target.value.length > 10) return;
                  if (!e.target.validity.valid && !!e.target.value) return;
                  setFields({
                    ...fields,
                    target: { ...fields.target, phone: e.target.value },
                  });
                }}
                disabled={!!isLoading}
                required
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
                disabled={!!isLoading}
                required
              />
            </div>
            {/*  */}
            {/*  */}
            <div className="col-span-2">
              <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                {tl("comment")} ({tl("optional")})
              </label>
              <Input
                value={fields.comment}
                onValueChange={(comment) => setFields({ ...fields, comment })}
                disabled={!!isLoading}
              />
            </div>
            {/*  */}
            {/*  */}
            <div className="mt-5 col-span-4">
              <p>
                La commande <code>{order._id}</code> sera remplacée par cette commande. Les articles{" "}
                {order.items.map((it) => it._id).join(", ")} seront récupérés.
              </p>
            </div>
            <div className="mt-10 col-span-4">
              <Button
                label={tl("Remplacer")}
                type="submit"
                btnColor="primary"
                icon="motorcycle"
                isLoading={isLoading}
              />
            </div>
            {/*  */}
          </div>
        </form>
      </div>
    </Fragment>
  );
};
