import { Drawer } from "@mui/material";
import { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { xCreateItems } from "../../utils/items";
import { Button, IconButton } from "../shared/Button";
import { ClientsCombobox } from "../shared/ClientsCombobox";
import { Checkbox, Input } from "../shared/Input";
import { ProductsCombobox } from "../shared/ProductsCombobox";
import { usePrint } from "../shared/ToolsProvider";
import { useEffect } from "react";
import { useTranslation } from "../../i18n/provider";

const blank_fields = {
  client_id: "",
  products: [],
  pickup: false,
};

export const AddItems = ({ ...props }) => {
  const [fields, setFields] = useState(blank_fields);
  const [createdItems, setCreatedItems] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const showToast = useToast();
  const showPrint = usePrint();
  const history = useHistory();
  const tl = useTranslation();

  function onClose() {
    history.go(-1);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await xCreateItems(fields);
    setLoading(false);
    if (error) {
      return showToast(error, "error");
    }
    setFields(blank_fields);
    setCreatedItems(data);
    return showToast("Succes", "success");
  }

  function triggerPrint() {
    showPrint(createdItems, { onPrint: resetComponent });
  }

  function resetComponent() {
    setFields(blank_fields);
    setCreatedItems([]);
  }

  useEffect(() => {
    if (createdItems.length > 0) triggerPrint();
  }, [createdItems]);

  useEffect(() => {
    setFields(blank_fields);
    if (props.open === false && createdItems.length > 0) setCreatedItems([]);
  }, [props.open]);

  return (
    <Drawer anchor="right" onClose={onClose} {...props}>
      <div className="w-screen sm:w-screen/1.5 lg:w-screen/2 h-full p-5 sm:p-10">
        {/*  */}
        <div className="mb-6">
          <IconButton icon="arrow-left" className="mr-3" iconColor="gray" onClick={onClose} />
          <span className="text-gray-700 text-lg md:text-2xl uppercase font-semibold">
            {tl("create_labels")}
          </span>
        </div>
        {/*  */}
        <div className="pb-10">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3 sm:gap-3">
              {/*  */}
              <div className="col-span-2">
                <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                  {tl("client")}
                </label>
                <ClientsCombobox
                  value={fields.client_id}
                  onValueChange={(client_id) =>
                    setFields((fields) => ({ ...fields, client_id, products: [] }))
                  }
                  disabled={isLoading || createdItems.length > 0}
                />
              </div>
              {/*  */}
              {/*  */}
              <div className="col-span-2">
                <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                  {tl("products")}
                </label>
                {fields.client_id ? (
                  <ProductsCombobox
                    client_id={fields.client_id}
                    value={fields.products}
                    onValueChange={(products) => setFields((fields) => ({ ...fields, products }))}
                    disabled={isLoading || createdItems.length > 0}
                    placeholder={createdItems.length > 0 ? "Étiquettes créées" : undefined}
                  />
                ) : (
                  <Input placeholder="Client requis" readOnly disabled />
                )}
              </div>
              {/* May cause issues in production */}
              {/* <div className="col-span-2 flex items-center gap-x-3 mt-2">
                <Checkbox
                  id="isPickup"
                  value={fields.pickup}
                  onValueChange={(pickup) => setFields((fields) => ({ ...fields, pickup }))}
                />
                <label className="text-gray-500" htmlFor="isPickup">
                  Pickup?
                </label>
              </div> */}
              {/* May cause issues in production */}
              {createdItems.length === 0 && (
                <div className="mt-5 col-span-2">
                  <Button
                    label={tl("create_labels")}
                    type="submit"
                    btnColor="primary"
                    icon="boxes"
                    isLoading={isLoading}
                    disabled={fields.products.length < 1 || createdItems.length > 0}
                  />
                </div>
              )}

              {createdItems.length > 0 && (
                <>
                  <div>
                    <Button
                      label={tl("abort")}
                      type="button"
                      btnColor="red"
                      icon="undo"
                      onClick={() => {
                        setCreatedItems([]);
                      }}
                    />
                  </div>
                  <div>
                    <Button
                      label={tl("print_labels")}
                      type="button"
                      btnColor="gray"
                      icon="print"
                      onClick={triggerPrint}
                    />
                  </div>
                </>
              )}
              {/*  */}
              {fields.products.length < 1 && (
                <div className="col-span-2 text-right text-link">
                  <Link to="/pickups/add">
                    <i className="fas fa-dolly"></i> {tl("add_onsite_pickup")}
                  </Link>
                </div>
              )}
              {/*  */}
            </div>
          </form>
        </div>
      </div>
    </Drawer>
  );
};
