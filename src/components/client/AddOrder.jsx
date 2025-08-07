import { Drawer } from "@mui/material";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { xAddFileOrders, xAddOrder } from "../../utils/orders";
import { Button, IconButton } from "../shared/Button";
import { CityCombobox } from "../shared/CityCombobox";
import { Input } from "../shared/Input";
import { ProductsCombobox } from "../shared/ProductsCombobox";
import { useDropzone } from "react-dropzone";
import { useStoreActions, useStoreState } from "easy-peasy";
import { useTranslation } from "../../i18n/provider";
import { useConfirmation } from "../shared/ToolsProvider";

const blank_order = {
  products: [],
  desired_date: "",
  status: "",
  cost: "",
  comment: "",
  target: {
    name: "",
    phone: "",
    city: "",
    address: "",
  },
  forceProducts: false,
};
const blank_locked_fields = {
  product_name: "",
};

export const AddOrder = ({ ...props }) => {
  const [fields, setFields] = useState(blank_order);
  const [lockedFields, setLockedFields] = useState(blank_locked_fields);
  const [isLoading, setLoading] = useState("");
  const [fileOrders, setFileOrders] = useState(null);

  const replaceDocument = useStoreActions((actions) => actions.orders.replaceOrder);
  const confirmAction = useConfirmation();

  const client_lock_items = useStoreState((state) => state.auth.user.client.lock_items);
  // hack strategy because user may not be listening to product stream yet, so excel products can't be accounted for.

  const history = useHistory();
  const showToast = useToast();
  const tl = useTranslation();
  // @ts-nocheck
  const isEditingLive = !isLoading && fileOrders?.remaining?.length;

  function onClose() {
    history.go(-1);
  }

  async function handleSave(e, extra_args = {}) {
    e?.preventDefault();
    setLoading("save");
    const { data, error, ...rest } = await xAddOrder({ ...fields, ...extra_args });
    setLoading("");

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

    setFields(blank_order);

    if (isEditingLive) {
      handleNextSuccess(data);
    } else {
      showToast("Success", "success");
    }
  }

  async function handleSend(e, extra_args = {}) {
    e?.preventDefault();
    setLoading("send");

    if (client_lock_items) {
      extra_args["products"] = [
        { quantity: 1, product_id: lockedFields.product_name, refr: fields.target.phone },
      ];
      extra_args["forceProducts"] = true;
    }

    const { data, error, ...rest } = await xAddOrder({
      ...fields,
      ...extra_args,
      status: "pending",
    });
    setLoading("");

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

    setFields(blank_order);
    setLockedFields(blank_locked_fields);
    replaceDocument({ _id: data._id, data });

    if (isEditingLive) {
      handleNextSuccess(data);
    } else {
      showToast("Success", "success");
    }
  }
  async function handleFile(file) {
    setFileOrders({ filename: file.name, remaining: [], added: [], loading: true });
    setLoading("file");
    const { data, error } = await xAddFileOrders(file);
    if (error) {
      showToast(error, "error");
      setFileOrders(null);
      return setLoading(false);
    } else if (data) {
      if (data.length) {
        setFileOrders({
          filename: file.name,
          remaining: data,
          added: [],
          loading: false,
          current: data[0],
        });
      } else {
        showToast("No Orders Parsed", "error");
        setFileOrders(null);
        return setLoading(false);
      }
    }
  }

  async function nextOrder(fields) {
    if (client_lock_items) {
      fields.products = fields.products.map((pr) => ({ ...pr, refr: fields.target.phone }));
    }
    const { data, error } = await xAddOrder({
      ...fields,
      status: "pending",
    });

    if (error) {
      showToast(error, "error");
      setFields(fields);
      return setLoading(false);
    } else if (data) {
      handleNextSuccess(data);
    }
  }

  function handleNextSuccess(order) {
    setFileOrders((fileOrders) => {
      const newRemaining = fileOrders.remaining.slice(1);
      const newAdded = order ? [...fileOrders.added, order] : fileOrders.added;
      return { ...fileOrders, remaining: newRemaining, added: newAdded, current: newRemaining[0] };
    });
  }

  function skipOrder(e) {
    e?.preventDefault();
    setFields(blank_order);
    // setErrorField("");
    setLoading(true);
    handleNextSuccess();
  }

  useEffect(() => {
    if (fileOrders?.current) {
      nextOrder(fileOrders.current);
    } else if (fileOrders) {
      showToast("Success", "success");
      setLoading(false);
      // setErrorField("");
      setFileOrders(null);
    }
  }, [fileOrders?.current]);

  return (
    <Drawer anchor="right" onClose={onClose} {...props}>
      <div className="w-screen sm:w-screen/1.5 lg:w-screen/2 h-full p-5 sm:p-10">
        {/*  */}
        <div className="mb-6">
          <IconButton icon="arrow-left" className="mr-3" iconColor="gray" onClick={onClose} />
          <span className="text-gray-700 text-lg md:text-2xl uppercase font-semibold">
            {tl("add_order")}
          </span>
        </div>
        {/*  */}
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
                  showComments
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
              <div
                className={
                  !fields.target.city || client_lock_items ? "hidden" : "col-span-2 md:col-span-4"
                }>
                <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                  {tl("products")}
                </label>
                <ProductsCombobox
                  value={fields.products}
                  onValueChange={(products) => setFields({ ...fields, products })}
                  query={{ order_city: fields.target.city }}
                  key={fileOrders?.remaining?.length} //
                  disabled={!!isLoading}
                  lockedOrder={client_lock_items}
                />
              </div>
              <div
                className={
                  !fields.target.city || !client_lock_items ? "hidden" : "col-span-2 md:col-span-4"
                }>
                <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                  {"Produit"}
                </label>
                <Input
                  value={lockedFields.product_name}
                  onValueChange={(product_name) =>
                    setLockedFields({ ...lockedFields, product_name })
                  }
                  disabled={!!isLoading}
                  placeholder="Écrivez le nom du produit"
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
              <div className="mt-5 col-span-2">
                {/* <Button
                  label={tl("save_draft")}
                  type="button"
                  btnColor="secondary"
                  icon="save"
                  isLoading={isLoading === "save"}
                  onClick={handleSave}
                /> */}
              </div>
              <div className="mt-5 col-span-2">
                <Button
                  label={tl("send_delivery")}
                  type="submit"
                  btnColor="primary"
                  icon="motorcycle"
                  isLoading={isLoading === "send"}
                  // onClick={handleSend}
                />
              </div>
              {isEditingLive && (
                <div className="col-span-2 mt-1">
                  <Button
                    label={tl("remove")}
                    btnColor="red"
                    icon="trash"
                    onClick={skipOrder}
                    disabled={!!isLoading}
                  />
                </div>
              )}
              {fileOrders && (
                <div className="col-span-2 md:col-span-4">
                  <ProgressIndicator
                    added={fileOrders.added.length}
                    remaining={fileOrders.remaining.length}
                    loading={fileOrders.loading}
                  />
                </div>
              )}
              <div className="col-span-2 md:col-span-4 text-center">
                <DropInput
                  value={fileOrders?.filename}
                  loading={!!isLoading}
                  onValueChange={handleFile}
                />
              </div>
              {/*  */}
            </div>
          </form>
        </div>
      </div>
    </Drawer>
  );
};

function DropInput({ onValueChange, loading, value }) {
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: ".xlsx, .xls",
  });

  useEffect(() => {
    if (acceptedFiles.length) {
      console.log("file uploaded.");
      onValueChange(acceptedFiles[0]);
    }
  }, [acceptedFiles]);

  const tl = useTranslation();

  return (
    <>
      <div
        {...getRootProps({
          style: { height: 125 },
          className:
            "relative bg-gray-100 hover:bg-gray-50 border-dashed border-4 flex items-center justify-center flex-col cursor-pointer mt-5 mb-1",
          disabled: !!loading,
        })}>
        <input {...getInputProps()} />
        {loading === "file" ? (
          <p>Parsing "{value}" </p>
        ) : (
          <>
            <i className="z-40 fas fa-file-upload text-6xl left-6 text-gray-200 absolute"></i>
            <p className="z-50 text-lg">{tl("drop_file")}</p>
          </>
        )}
      </div>
      <a
        href="https://docs.google.com/spreadsheets/d/18MhaSkX0Cp4wOJqKp4yRiL74lGDoRo3gBk4SJpLf7VY/copy"
        target="_blank"
        className="text-md font-bold text-green-500 hover:underline"
        rel="noreferrer">
        <i className="far fa-file-excel"></i> {tl("copy_model")}
      </a>
    </>
  );
}

function ProgressIndicator({ remaining, added, loading }) {
  const progressWidth = (() => {
    if (added === 0) return 0;
    if (remaining === 0) return 100;
    return (added / (remaining + added)) * 100;
  })();

  const tl = useTranslation();

  return (
    <div className="relative pt-1">
      <div className="flex mb-2 items-center justify-between">
        <div>
          {loading ? (
            <span className="text-xs font-semibold inline-block py-1 px-5 uppercase rounded-full text-gray-600 bg-gray-200 animate-pulse">
              {tl("parsing_file")}...
            </span>
          ) : (
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
              {added} {tl("orders_added")}
            </span>
          )}
        </div>
        <div className="text-right">
          {!loading && (
            <span className="text-xs font-semibold inline-block text-red-500">
              {remaining} {tl("remaining")}
            </span>
          )}
        </div>
      </div>
      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
        <div
          style={{ width: `${progressWidth}%` }}
          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-width duration-300 ease-out"></div>
      </div>
    </div>
  );
}
