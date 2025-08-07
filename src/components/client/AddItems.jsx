import { Drawer } from "@mui/material";
import { useState } from "react";
import { useToast } from "../../hooks/useToast";
import { Button, IconButton } from "../shared/Button";
import { ProductsCombobox } from "../shared/ProductsCombobox";
import { xCreateItems } from "../../utils/items";
import { useHistory } from "react-router-dom";
import { usePrint } from "../shared/ToolsProvider";
import { useEffect } from "react";
import { useTranslation } from "../../i18n/provider";

const blank_fields = {
  products: [],
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
          <span className="text-gray-700 text-lg md:text-2xl uppercase font-semibold">{tl("add_products")}</span>
        </div>
        {/*  */}
        <div className="pb-10">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/*  */}
              <div className="col-span-2 md:col-span-4">
                <label className="block mb-2 text-md font-medium text-gray-700 font-sans">{tl("products")}</label>
                <ProductsCombobox
                  value={fields.products}
                  onValueChange={products => setFields({ ...fields, products })}
                  disabled={isLoading || createdItems.length > 0}
                  placeholder={createdItems.length > 0 ? "Items Created" : undefined}
                />
              </div>
              {/*  */}
              {createdItems.length === 0 && (
                <div className="mt-5 col-span-2 md:col-span-4">
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
                  <div className="md:col-span-2">
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
                  <div className="md:col-span-2">
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
            </div>
          </form>
        </div>
      </div>
    </Drawer>
  );
};
