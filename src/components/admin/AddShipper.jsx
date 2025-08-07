import { Drawer } from "@mui/material";
import { useState, useEffect } from "react";
import { useStoreState } from "easy-peasy";
import { useToast } from "../../hooks/useToast";
import { xAddShipper } from "../../utils/shippers";
import { Button, IconButton } from "../shared/Button";
import { Input, NumberInput } from "../shared/Input";
import { useBackClose } from "../shared/LastLocation";
import lodash from "lodash";
import { useTranslation } from "../../i18n/provider";
import { CityCombobox } from "../shared/CityCombobox";
import { Label } from "../shared/Label";

const blank_fields = {
  name: "",
  last_payment: "",
  balance: 0,
  _default: 0,
  cities: [],
};

export const AddShipper = ({ ...props }) => {
  const [fields, setFields] = useState(blank_fields);
  const [isLoading, setLoading] = useState(false);
  const { cities, loading } = useStoreState((state) => state.cities);
  const mainCities = cities.filter((city) => city.isMainCity).map((city) => city.name);

  const showToast = useToast();
  const tl = useTranslation();
  const onClose = useBackClose("/shippers");

  async function handleSubmit(e) {
    e.preventDefault();
    let body = lodash.cloneDeep(fields);

    setLoading(true);
    const { error } = await xAddShipper({ ...body });
    setLoading(false);
    if (error) {
      return showToast(error, "error");
    }
    setFields(blank_fields);
    return showToast("Success", "success");
  }

  function addCityFee(e) {
    e.preventDefault();
    setFields({
      ...fields,
      cities: [...fields.cities, ""]
    });
  }

  useEffect(() => {
    setFields({
      ...fields,
      cities: [...mainCities]
    });
  }, []);

  return (
    <Drawer anchor="right" onClose={onClose} {...props}>
      <div className="w-screen sm:w-screen/1.5 h-full p-5 sm:p-10">
        {/*  */}
        <div className="mb-6">
          <IconButton icon="arrow-left" className="mr-3" iconColor="gray" onClick={onClose} />
          <span className="text-gray-700 text-lg md:text-2xl uppercase font-semibold">
            {tl("add_shipper")}
          </span>
        </div>
        {/*  */}
        <div className="pb-10">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3 sm:gap-3">
              {/*  */}
              <div className="col-span-2">
                <Label text={tl("name")} />
                <Input
                  value={fields.name}
                  onValueChange={(name) => setFields({ ...fields, name })}
                  disabled={isLoading}
                />
              </div>
              {/*  */}
              {/*  */}
              <div className="col-span-2">
                <Label text="Default Fee" />
                <Input
                  value={fields._default}
                  onValueChange={(_default) => setFields({ ...fields, _default })}
                  disabled={isLoading}
                />
              </div>
              {/*  */}
              {/*  */}
              {[...fields.cities].map((city, i) => (
                <div
                  key={`${city}~${i}~${"cit"}`}
                  className="grid grid-cols-6 gap-x-1 col-span-3 items-end">
                  <div className="col-span-3 mr-3">
                    <Label text="City" />
                    <CityCombobox
                      getOptions={(cities) =>
                        cities.filter((city) => city.isMainCity).map((city) => city.name)
                      }
                      value={city}
                      onValueChange={(city) => console.log(city)}
                    />
                  </div>
                  <div className="col-span-1">
                    <Label text="Fee" />
                    <NumberInput
                      value={fields[`${city}`]}
                      onValueChange={(fee) => console.log(fee)}
                    />
                  </div>
                  <div className="h-full">
                    <Label text="remove" className="invisible mb-3" />
                    <div className="flex items-center justify-center">
                      <div
                        className="flex items-center h-10 w-10 justify-center bg-red-500 rounded-full text-white
                              cursor-pointer shadow-sm hover:shadow-md"
                        onClick={() => alert(i)}>
                        <i className="fas fa-times"></i>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="mb-10">
                <Button icon="plus" label="Add City Fee" onClick={addCityFee} />
              </div>
              {/*  */}
              {/*  */}
              <div></div>
              {/*  */}
              <div className="mt-5 col-span-3">
                <Button label={tl("add_shipper")} type="submit" isLoading={isLoading} />
              </div>
              {/*  */}
            </div>
          </form>
        </div>
      </div>
    </Drawer>
  );
};
