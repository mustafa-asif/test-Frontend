import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { useStoreActions, useStoreState } from "easy-peasy";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { useTranslation } from "../../i18n/provider";
import { xFetch } from "../../utils/constants";
import { cl } from "../../utils/misc";
import { xAddProduct, xGetClientProducts } from "../../utils/products";
import { Input } from "./Input";
import { useConfirmation } from "./ToolsProvider";

const filter = createFilterOptions();

export const ProductsCombobox = ({
  client_id,
  className = undefined,
  inputProps: inProps,
  value,
  onValueChange,
  placeholder,
  allItems,
  disabledAdd,
  query = {},
  maxQuantity, // not implemented yet
  maxProducts, // not implemented yet
  lockedOrder,
  ...props
}) => {
  const user = useStoreState((state) => state.auth.user);
  const removeProduct = useStoreActions((state) => state.products.removeProduct);
  if (user.role === "client") client_id = user.client._id;

  if (!client_id) throw new Error(`no client_id`);

  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const updateInputProducts = useCallback(() => {
    setLoaded(false);
    setProducts([]);
    xGetClientProducts(client_id, query)
      .then((res) => {
        if (res.data) setProducts(res.data);
      })
      .finally(() => setLoaded(true));
  }, [client_id, ...Object.values(query)]);

  useEffect(() => {
    updateInputProducts();
  }, [client_id, ...Object.values(query)]);

  const showToast = useToast();
  const confirmAction = useConfirmation();
  const tl = useTranslation();

  const [inputVal, setInputVal] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);

  function editProductQuantity(quantity, id) {
    onValueChange(
      value.map((pr) => {
        if (pr.product_id === id) pr.quantity = quantity;
        return pr;
      })
    );
  }

  function selectProduct(id) {
    // console.log("selecting product %s", id);
    const quantity = !allItems ? 1 : products.find((pr) => pr._id === id)?.free;
    if (typeof quantity === "undefined") return;
    onValueChange([...value, { product_id: id, quantity }]);
    setInputVal("");
  }

  function deselectProduct(id) {
    // console.log("deselecting product %s", id);
    onValueChange(value.filter((pr) => pr.product_id !== id));
  }

  async function deleteProduct(product) {
    setDelLoading(product.name);
    const { error } = await xFetch(`/products/${product._id}`, { method: "DELETE" });
    setDelLoading(false);
    if (error) return showToast(error, "error");
    showToast("success", "success");
    setProducts(products.filter((prod) => prod._id !== product._id));
    removeProduct(product._id);
  }

  async function createProduct(name) {
    setAddLoading(name);
    const { data, error } = await xAddProduct({ name });
    setAddLoading(null);
    if (error) {
      showToast(error, "error");
      return;
    }
    setProducts((products) => [...products, { _id: data._id, name: data.name, free: 0 }]);
    selectProduct(data._id);
    showToast("Success", "success");
  }

  return (
    //
    <div className="flex flex-col gap-y-2">
      <div
        className={cl("flex items-center relative", {
          hidden: lockedOrder && value.length > 0,
        })}>
        <Autocomplete
          className="w-full"
          disabled={props.disabled || !!addLoading || delLoading || !!disabledAdd}
          value={""}
          autoHighlight={true}
          noOptionsText={loaded ? tl("no_products") : "Loading..."}
          inputValue={inputVal}
          onInputChange={(_, val) => setInputVal(val)}
          onChange={(e, newValue) => {
            e.preventDefault();
            if (typeof newValue === "string") {
              // setComponentValue({
              //   name: newValue,
              // });
            } else if (newValue && newValue.inputValue) {
              // Create a new value from the user input
              createProduct(newValue.inputValue);
              setInputVal("");
            } else if (newValue?._id) {
              selectProduct(newValue._id);
            }
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);

            const { inputValue } = params;
            // Suggest the creation of a new value
            const isExisting = options.some((option) => inputValue === option.name);
            if (inputValue !== "" && !isExisting && user.role === "client") {
              filtered.push({
                inputValue,
                name: `${tl("add")} "${inputValue}"`,
              });
            }

            return filtered.filter(
              (option) => !value.some((used) => used.product_id === option._id)
            );
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          options={products}
          getOptionLabel={(option) => {
            // Value selected with enter, right from the input
            if (typeof option === "string") {
              return option;
            }
            // Add "xxx" option created dynamically
            if (option.inputValue) {
              return option.inputValue;
            }
            // Regular option
            return option.name;
          }}
          renderOption={(props, option) => {
            const isForNew = option.name.startsWith(tl("add"));
            const free = !isForNew && option.free;
            return (
              <li {...props}>
                {isForNew && <i className="fas fa-plus text-green-500 mr-2"></i>}
                {option.name}
                {free > 0 && (
                  <span className="ml-1">
                    (<span className="text-green-500">{free}</span>)
                  </span>
                )}
                {free < 0 && !lockedOrder && (
                  <span className="ml-1">
                    (<span className="text-red-500">{free}</span>)
                  </span>
                )}
                {free === 0 && user.role === "client" && !lockedOrder && (
                  <span className="ml-1">
                    (<span className="text-red-500">0</span>)
                    <i
                      className="fas fa-trash text-red-500 ml-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmAction({
                          title: `${tl("del_product")} ${option.name}?`,
                          onConfirm: () => deleteProduct(option),
                        });
                      }}></i>
                  </span>
                )}
              </li>
            );
          }}
          renderInput={(params) => {
            const { className: muClass = "", ...inputProps } = params.inputProps;
            const defaultClass =
              "transition-colors duration-200 px-3 text-gray-700 cursor-default w-full bg-white border rounded-full outline-none border-gray-400 focus:outline-none focus:border-green-500 focus:shadow-md hover:bg-gray-50 focus:bg-gray-50 ";
            const defaultStyles = { height: 46 };
            return (
              <div ref={params.InputProps.ref} className={cl("relative w-full")}>
                {addLoading && (
                  <div className="absolute left-3 top-0 bottom-0 m-auto flex items-center">
                    <span
                      style={{ borderTopColor: "#FBBF24" }}
                      className="inline-block w-6 h-6 rounded-full border-4 border-t-4 border-gray animate-spin"></span>
                    <span className="text-gray-700 ml-3 animate-pulse">
                      Saving Product '{addLoading}'...
                    </span>
                  </div>
                )}
                {delLoading && (
                  <div className="absolute left-3 top-0 bottom-0 m-auto flex items-center">
                    <span
                      style={{ borderTopColor: "#FBBF24" }}
                      className="inline-block w-6 h-6 rounded-full border-4 border-t-4 border-gray animate-spin"></span>
                    <span className="text-gray-700 ml-3 animate-pulse">
                      Deleting Product '{delLoading}'...
                    </span>
                  </div>
                )}
                <input
                  role="presentation"
                  autoComplete="off"
                  maxLength="14"
                  placeholder={
                    placeholder || (addLoading || delLoading ? "" : tl("add_new_product"))
                  }
                  className={cl(defaultClass, className)}
                  style={{ ...defaultStyles }}
                  {...inProps}
                  {...inputProps}
                  required={props.required}
                />
              </div>
            );
          }}
        />
        <div className="flex items-center flex-col justify-center px-4 border-l text-gray-500 absolute right-0 bottom-0 top-0 mx-auto z-20 pointer-events-none">
          <i className="fas fa-chevron-up"></i>
          <i className="fas fa-chevron-down"></i>
        </div>
      </div>

      {value.map(({ product_id, quantity }, index) => (
        <div
          key={product_id + index}
          className="col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
          <div className={cl("col-span-4 relative", { "sm:col-span-3": !lockedOrder })}>
            <Input
              readOnly
              disabled={props.disabled}
              key={index + "" + products.length}
              className="pointer-events-none"
              defaultValue={
                products.find(
                  (pr) => pr._id === product_id || new RegExp(product_id, "i").test(pr.name)
                )?.name || product_id
              }
              tabIndex={-1}
              required
            />
            <button
              className="flex items-center flex-col justify-center px-4 border-l text-red-500 absolute right-1 bottom-1 top-1 mx-auto z-20 hover:bg-gray-50 rounded-r-full outline-none"
              disabled={props.disabled}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                deselectProduct(product_id);
              }}
              tabIndex={-1}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          <Input
            type="tel"
            pattern="[0-9]*"
            value={quantity}
            disabled={props.disabled}
            className={cl({ hidden: lockedOrder })}
            onChange={(e) => {
              if (!e.target.validity.valid && !!e.target.value) return;
              if (e.target.value === "") {
                return editProductQuantity("0", product_id);
              }
              if (e.target.value.startsWith("0") && e.target.value.length > 1) {
                return editProductQuantity(e.target.value.replace(/^0/, ""), product_id);
              }
              editProductQuantity(e.target.validity.valid ? e.target.value : "", product_id);
            }}
            tabIndex={0}
            required
          />
        </div>
      ))}
    </div>
    //
  );
};
