import { Drawer } from "@mui/material";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { useTranslation } from "../../i18n/provider";
import { xAddPickup } from "../../utils/pickups";
import { Button, IconButton } from "../shared/Button";
import { CityCombobox } from "../shared/CityCombobox";
import { FormDatePicker } from "../shared/FormDatePicker";
import { Checkbox, Input, NumberInput } from "../shared/Input";
import { useStoreState } from "easy-peasy";

export const AddPickup = ({ ...props }) => {
  const user = useStoreState((state) => state.auth.user);

  const blank_pickup = {
    desired_date: "",
    comment: "",
    target: {
      name: user.name,
      phone: user.phone,
      city: user.client.location.city,
      address: user.client.location.address,
    },
    items_count: "",
    needs_packaging: false,
  };

  const [fields, setFields] = useState(blank_pickup);
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
    const { error } = await xAddPickup(fields);
    setLoading(false);
    if (error) {
      return showToast(error, "error");
    }
    showToast("Success", "success");
    setFields(blank_pickup);
  }
  return (
    <Drawer anchor="right" onClose={onClose} {...props}>
      <div className="w-screen sm:w-screen/1.5 lg:w-screen/2 h-full p-5 sm:p-10">
        {/*  */}
        <div className="mb-6">
          <IconButton icon="arrow-left" className="mr-3" iconColor="gray" onClick={onClose} />
          <span className="text-gray-700 text-lg md:text-2xl uppercase font-semibold">
            {tl("request_pickup")}
          </span>
        </div>
        {/*  */}
        <div className="pb-10">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/*  */}
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
              {/*  */}
              <div className="col-span-2">
                <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                  {tl("number_of_items")} ({tl("optional")})
                </label>
                <NumberInput
                  value={fields.items_count}
                  onValueChange={(items_count) => setFields({ ...fields, items_count })}
                  disabled={isLoading}
                />
              </div>
              {/*  */}
              {/*  */}
              <div className="col-span-4">
                <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                  {tl("comment")} ({tl("optional")})
                </label>
                <Input
                  value={fields.comment}
                  onValueChange={(comment) => setFields({ ...fields, comment })}
                  disabled={isLoading}
                />
              </div>
              {/*  */}
              {/*  */}
              <div className="col-span-2 flex items-center gap-x-3 mt-2">
                <Checkbox
                  id="packaging"
                  value={fields.needs_packaging}
                  onValueChange={(needs_packaging) =>
                    setFields((fields) => ({ ...fields, needs_packaging }))
                  }
                  disabled={isLoading}
                />
                <label className="text-gray-500" htmlFor="packaging">
                  {tl("needs packaging")}
                </label>
              </div>
              {/*  */}
              <div className="mt-5 col-span-2 md:col-span-4">
                <Button
                  label={tl("request_pickup")}
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
