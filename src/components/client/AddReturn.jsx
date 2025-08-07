import { Drawer } from "@mui/material";
import { useState, Fragment } from "react";
import { useHistory } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { useTranslation } from "../../i18n/provider";
import { xAddPickup } from "../../utils/pickups";
import { Button, IconButton } from "../shared/Button";
import { CityCombobox } from "../shared/CityCombobox";
import { FormDatePicker } from "../shared/FormDatePicker";
import { Checkbox, Input, NumberInput } from "../shared/Input";
import { useStoreState } from "easy-peasy";
import { xFetch } from "../../utils/constants";
import { xAddPurge } from "../../utils/purges";
import { cl } from "../../utils/misc";

export const AddReturn = ({ ...props }) => {
  const user = useStoreState((state) => state.auth.user);

  const blank_purge = {
    desired_date: "",
    description: "",
    kind: "delivered",
    target: {
      name: user.name,
      phone: user.phone,
      city: "casablanca",
      address: "",
    },
  };

  const [fields, setFields] = useState(blank_purge);
  const [isLoading, setLoading] = useState(false);

  const showToast = useToast();
  const history = useHistory();
  const tl = useTranslation();

  function onClose() {
    history.go(-1);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const { error } = await xAddPurge(fields);
    setLoading(false);
    if (error) {
      return showToast(error, "error");
    }
    showToast("Success", "success");
    setFields(blank_purge);
  }
  return (
    <Drawer anchor="right" onClose={onClose} {...props}>
      <div className="w-screen sm:w-screen/1.5 lg:w-screen/2 h-full p-5 sm:p-10">
        {/*  */}
        <div className="mb-6">
          <IconButton icon="arrow-left" className="mr-3" iconColor="gray" onClick={onClose} />
          <span className="text-gray-700 text-lg md:text-2xl uppercase font-semibold">
            {tl("Demander un retour")}
          </span>
        </div>
        {/*  */}
        <div className="pb-10">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/*  */}
              <div className="col-span-4">
                <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                  {tl("description")}
                </label>
                <Input
                  value={fields.description}
                  onValueChange={(description) =>
                    setFields((fields) => ({ ...fields, description }))
                  }
                  disabled={isLoading}
                />
              </div>
              {/*  */}
              <div className="col-span-4 my-[10px]">
                <div className="flex">
                  {/*  */}
                  <input
                    type="radio"
                    className="hidden"
                    checked={fields.kind === "onsite"}
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="radio1"
                    className="flex items-center cursor-pointer mr-3"
                    onClick={() => {
                      if (isLoading) return;
                      setFields((fields) => ({
                        ...fields,
                        kind: "onsite",
                        target: undefined,
                        desired_date: undefined,
                      }));
                    }}>
                    <span className="w-4 h-4 inline-block mr-2 border border-gray"></span>
                    <i className="fas fa-warehouse pr-1"></i>Sur Place
                  </label>
                  {/*  */}
                  <input
                    type="radio"
                    className="hidden"
                    checked={fields.kind === "delivered"}
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="radio2"
                    className="flex items-center cursor-pointer mr-3"
                    onClick={() => {
                      if (isLoading) return;
                      setFields((fields) => ({
                        ...fields,
                        kind: "delivered",
                        target: blank_purge.target,
                        desired_date: "",
                      }));
                    }}>
                    <span className="w-4 h-4 inline-block mr-2 border border-gray"></span>
                    <i className="fas fa-motorcycle pr-1"></i>Livre
                  </label>
                </div>
              </div>

              {fields.kind === "delivered" && fields.target && (
                <Fragment>
                  <div className="col-span-2">
                    <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                      {tl("city")}
                    </label>
                    <CityCombobox
                      getOptions={(cities) =>
                        cities.filter((city) => city.isMainCity).map((city) => city.name)
                      }
                      value={fields.target.city}
                      onValueChange={(city) =>
                        setFields({ ...fields, target: { ...fields.target, city } })
                      }
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
                      disabled={isLoading}
                      required
                    />
                  </div>
                  {/*  */}
                  {/*  */}
                  <div className="col-span-2">
                    <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                      {tl("desired_date")} ({tl("optional")})
                    </label>
                    <FormDatePicker
                      value={fields.desired_date}
                      onValueChange={(desired_date) => setFields({ ...fields, desired_date })}
                      disabled={isLoading}
                    />
                  </div>
                  {/*  */}
                </Fragment>
              )}

              <div className="mt-5 col-span-2 md:col-span-4">
                <Button
                  label={tl("demander")}
                  type="submit"
                  btnColor="primary"
                  icon="dolly"
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
