import { Drawer } from "@mui/material";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { useTranslation } from "../../i18n/provider";
import { xAddTransfer } from "../../utils/transfers";
import { Button, IconButton } from "../shared/Button";
import { CityCombobox } from "../shared/CityCombobox";
import { FormDatePicker } from "../shared/FormDatePicker";
import { Input } from "../shared/Input";
import { ProductsCombobox } from "../shared/ProductsCombobox";

const blank_transfer = {
  from_city: "",
  to_city: "",
  products: [],
};

export const AddTransfer = ({ ...props }) => {
  const [fields, setFields] = useState(blank_transfer);
  const [isLoading, setLoading] = useState(false);

  const showToast = useToast();
  const tl = useTranslation();
  const history = useHistory();

  function onClose() {
    history.go(-1);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const { error } = await xAddTransfer(fields);
    setLoading(false);
    if (error) {
      return showToast(error, "error");
    }
    showToast("Success", "success");
    setFields(blank_transfer);
  }
  return (
    <Drawer anchor="right" onClose={onClose} {...props}>
      <div className="w-screen sm:w-screen/1.5 lg:w-screen/2 h-full p-5 sm:p-10">
        {/*  */}
        <div className="mb-6">
          <IconButton icon="arrow-left" className="mr-3" iconColor="gray" onClick={onClose} />
          <span className="text-gray-700 text-lg md:text-2xl uppercase font-semibold">{tl("request_transfer")}</span>
        </div>
        {/*  */}
        <div className="pb-10">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/*  */}
              <div className="col-span-2">
                <label className="block mb-2 text-md font-medium text-gray-700 font-sans">{tl("from_city")}</label>
                <CityCombobox
                  value={fields.from_city}
                  onValueChange={from_city => setFields({ ...fields, from_city })}
                  getOptions={cities => {
                    const mainCitiesWithItems = cities.filter(city => city.isMainCity && city.hasItems);
                    return mainCitiesWithItems.map(city => city.name);
                  }}
                  required
                />
              </div>
              {/*  */}
              {/*  */}
              <div className="col-span-2">
                <label className="block mb-2 text-md font-medium text-gray-700 font-sans">{tl("to_city")}</label>
                <CityCombobox
                  value={fields.to_city}
                  onValueChange={to_city => setFields({ ...fields, to_city })}
                  getOptions={cities => {
                    const mainCities = cities.filter(city => city.isMainCity);
                    return mainCities.map(city => city.name);
                  }}
                  required
                />
              </div>
              {/*  */}
              <div className={!fields.from_city ? "hidden" : "col-span-2 md:col-span-4"}>
                <label className="block mb-2 text-md font-medium text-gray-700 font-sans">{tl("products")}</label>
                <ProductsCombobox
                  value={fields.products}
                  query={{ transfer_city: fields.from_city }}
                  onValueChange={products => setFields({ ...fields, products })}
                  disabled={isLoading}
                  allItems
                />
              </div>
              <div className="mt-5 col-span-2 md:col-span-4">
                <Button
                  label={tl("request_transfer")}
                  type="submit"
                  btnColor="primary"
                  icon="truck"
                  isLoading={isLoading}
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
