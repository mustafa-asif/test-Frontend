import { Drawer } from "@mui/material";
import { useState } from "react";
import { useToast } from "../../hooks/useToast";
import { xFetch } from "../../utils/constants";
import { formatBankNumber, xUploadImage } from "../../utils/misc";
import { Button, IconButton } from "../shared/Button";
import { CityCombobox } from "../shared/CityCombobox";
import { FileInput } from "../shared/FileInput";
import { Checkbox, Input, NumberInput } from "../shared/Input";
import { Label } from "../shared/Label";
import { useBackClose } from "../shared/LastLocation";

const blank_fields = {
  name: "",
  phone: "",
  password: "",
  image: "",
  government_id: "",
  role: "warehouse",
  warehouse: {
    name: "",
    city: "",
    working_cities: [],
    options: {
      orders: true,
      pickups: false,
      returns: false,
      transfer_in: false,
      transfer_out: false,
      lock_items: false,
    },
    bank: {
      number: "",
      name: "",
    },
    fees: {
      warehouse: {
        order: { cities: [] },
        pickup: { cities: [] },
        refusal: { cities: [] },
        packaging: {},
      },
      deliverer: {
        order: { cities: [] },
        pickup: { cities: [] },
        refusal: { cities: [] },
      },
    },
  },
  active: true,
};

export const AddWarehouse = ({ ...props }) => {
  const [fields, setFields] = useState(blank_fields);
  const [images, setImages] = useState({ image: null });
  const [isLoading, setLoading] = useState(false);

  const showToast = useToast();
  const onClose = useBackClose("/warehouses");

  async function handleSubmit(e) {
    e.preventDefault();
    if (isLoading) return;
    let body = fields;
    setLoading(true);
    if (images.image) {
      const { data, error } = await xUploadImage(images.image);
      if (error) {
        setLoading(false);
        return showToast(error, "error");
      }
      body.image = data;
    }
    const { data, error } = await xFetch(`/users`, { method: "POST", body });
    setLoading(false);
    if (error) {
      return showToast(error);
    }
    setFields(blank_fields);
    showToast("success", "success");
  }

  function addWorkingCity() {
    setFields({
      ...fields,
      warehouse: {
        ...fields.warehouse,
        working_cities: [...fields.warehouse.working_cities, ""],
        fees: {
          ...fields.warehouse.fees,
          warehouse: {
            packaging: {},
            order: {
              cities: [
                ...fields.warehouse.fees.warehouse.order.cities,
                { _id: `fee~${Date.now()}~order`, city: "", fee: "" },
              ],
            },
            pickup: {
              cities: [
                ...fields.warehouse.fees.warehouse.pickup.cities,
                { _id: `fee~${Date.now()}~pickup`, city: "", fee: "" },
              ],
            },
            refusal: {
              cities: [
                ...fields.warehouse.fees.warehouse.refusal.cities,
                { _id: `fee~${Date.now()}~refusal`, city: "", fee: "" },
              ],
            },
          },
        },
      },
    });
  }

  function removeWorkingCity(index) {
    setFields({
      ...fields,
      warehouse: {
        ...fields.warehouse,
        working_cities: fields.warehouse.working_cities.filter((_, i) => i !== index),
        fees: {
          ...fields.warehouse.fees,
          warehouse: {
            packaging: {},
            order: {
              cities: fields.warehouse.fees.warehouse.order.cities.filter((_, i) => i !== index),
            },
            pickup: {
              cities: fields.warehouse.fees.warehouse.pickup.cities.filter((_, i) => i !== index),
            },
            refusal: {
              cities: fields.warehouse.fees.warehouse.refusal.cities.filter((_, i) => i !== index),
            },
          },
        },
      },
    });
  }

  function onWorkingCityChange(newCity, oldCity, index) {
    setFields((fields) => ({
      ...fields,
      warehouse: {
        ...fields.warehouse,
        working_cities: fields.warehouse.working_cities.map((city, i) => {
          if (city === oldCity && i === index) return newCity;
          return city;
        }),
        fees: {
          ...fields.warehouse.fees,
          warehouse: {
            ...fields.warehouse.fees.warehouse,
            order: {
              cities: fields.warehouse.fees.warehouse.order.cities.map((fee, i) => {
                if (fee.city === oldCity && i === index) fee.city = newCity;
                return fee;
              }),
            },
            pickup: {
              cities: fields.warehouse.fees.warehouse.pickup.cities.map((fee, i) => {
                if (fee.city === oldCity && i === index) fee.city = newCity;
                return fee;
              }),
            },
            refusal: {
              cities: fields.warehouse.fees.warehouse.refusal.cities.map((fee, i) => {
                if (fee.city === oldCity && i === index) fee.city = newCity;
                return fee;
              }),
            },
          },
        },
      },
    }));
  }

  function onFeeChange(fee_value, subkey, fee_id) {
    setFields((fields) => ({
      ...fields,
      warehouse: {
        ...fields.warehouse,
        fees: {
          ...fields.warehouse.fees,
          warehouse: {
            ...fields.warehouse.fees.warehouse,
            [subkey]: {
              cities: fields.warehouse.fees.warehouse[subkey].cities.map((fee) => {
                if (fee._id === fee_id) fee.fee = fee_value;
                return fee;
              }),
            },
          },
        },
      },
    }));
  }

  return (
    <Drawer anchor="right" onClose={onClose} {...props}>
      <div className="w-screen sm:w-screen/1.5 h-full p-5 sm:p-10">
        {/*  */}
        <div className="mb-6">
          <IconButton icon="arrow-left" className="mr-3" iconColor="gray" onClick={onClose} />
          <span className="text-gray-700 text-lg md:text-2xl uppercase font-semibold">
            {"Create Warehouse"}
          </span>
        </div>
        {/*  */}
        <div className="pb-10">
          <div className="grid grid-cols-3 gap-3 sm:gap-3">
            {/*  */}
            <div className="col-span-1">
              <Label text={"User Name"} />
              <Input
                value={fields.name}
                onValueChange={(name) => setFields({ ...fields, name })}
                disabled={isLoading}
              />
            </div>
            {/*  */}
            <div className="col-span-1">
              <Label text={"User Phone"} />
              <NumberInput
                value={fields.phone}
                onValueChange={(phone) => {
                  if (phone.length > 10) return;
                  setFields({ ...fields, phone });
                }}
                disabled={isLoading}
              />
            </div>
            {/*  */}
            <div className="col-span-1">
              <Label text={"User Password"} />
              <Input
                value={fields.password}
                onValueChange={(password) => setFields({ ...fields, password })}
                disabled={isLoading}
                type="password"
              />
            </div>
            {/*  */}
            <div className="col-span-1">
              <Label text={"User Government ID"} />
              <Input
                value={fields.government_id}
                onValueChange={(government_id) => setFields({ ...fields, government_id })}
                disabled={isLoading}
              />
            </div>
            {/*  */}
            <div className="col-span-1">
              <Label text={"Profile Image"} />
              <FileInput
                file={images.image}
                setFile={(image) => setImages({ ...images, image })}
                disabled={isLoading}
              />
            </div>
            {/*  */}
            <div className="col-span-1">
              <Label text={"Warehouse Name"} />
              <Input
                value={fields.warehouse.name}
                onValueChange={(name) =>
                  setFields({ ...fields, warehouse: { ...fields.warehouse, name } })
                }
                disabled={isLoading}
              />
            </div>
            {/*  */}
            <div className="col-span-1">
              <Label text={"Warehouse Physical Location"}></Label>
              <CityCombobox
                value={fields.warehouse.city}
                onValueChange={(city) =>
                  setFields({ ...fields, warehouse: { ...fields.warehouse, city } })
                }
                disabled={isLoading}
              />
            </div>
            {/*  */}
            <div className="col-span-1">
              <Label text={"RIB"} />
              <Input
                pattern="[^'\x22]+"
                value={fields.warehouse.bank.number}
                onValueChange={(number) =>
                  setFields({
                    ...fields,
                    warehouse: {
                      ...fields.warehouse,
                      bank: { ...fields.warehouse.bank, number: formatBankNumber(number) },
                    },
                  })
                }
                disabled={isLoading}
              />
            </div>
            {/*  */}
            <div className="col-span-1">
              <Label text={"Bank Name"} />
              <Input
                value={fields.warehouse.bank.name}
                onValueChange={(name) =>
                  setFields({
                    ...fields,
                    warehouse: { ...fields.warehouse, bank: { ...fields.warehouse.bank, name } },
                  })
                }
                disabled={isLoading}
              />
            </div>
            <Label text={"Working Cities"}></Label>
            {fields.warehouse.working_cities.map((city, i) => (
              <div
                key={`${city}~${i}~${"cit"}`}
                className="grid grid-cols-6 gap-x-1 col-span-3 items-end">
                <div className="col-span-2">
                  {/* <Label text="City" /> */}
                  <CityCombobox
                    value={city}
                    onValueChange={(newCity) => onWorkingCityChange(newCity, city, i)}
                  />
                </div>
                {["order", "pickup", "refusal"].map((subkey) => {
                  const fee = fields.warehouse.fees.warehouse[subkey].cities.find(
                    (fee) => fee.city === city
                  );
                  if (!fee) {
                    return (
                      <p>
                        Missing {subkey} fee for city {city}
                      </p>
                    );
                  }
                  return (
                    <div key={fee._id} className="col-span-1">
                      <Label text={`${subkey} fee`} />
                      <NumberInput
                        value={fee.fee}
                        onValueChange={(newValue) => onFeeChange(newValue, subkey, fee._id)}
                      />
                    </div>
                  );
                })}
                <div className="h-full">
                  <Label text="remove" className="invisible mb-3" />
                  <div className="flex items-center justify-center">
                    <div
                      className="flex items-center h-10 w-10 justify-center bg-red-500 rounded-full text-white cursor-pointer shadow-sm hover:shadow-md"
                      onClick={() => removeWorkingCity(i)}>
                      <i className="fas fa-times"></i>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="mb-10">
              <Button icon="plus" label="Add City" onClick={addWorkingCity} />
            </div>
            {/*  */}
            <div className="col-span-3 flex items-center gap-x-1">
              <Checkbox
                id="isActive"
                value={fields.warehouse.active}
                onValueChange={(active) =>
                  setFields({ ...fields, warehouse: { ...fields.warehouse, active } })
                }
                disabled={isLoading}
              />
              <Label text="warehouse is active" className="capitalize" htmlFor="isActive" />
            </div>
            {/*  */}
            <div className="col-span-3 flex items-center gap-x-1">
              <Checkbox
                id="canOrders"
                value={fields.warehouse.options.orders}
                onValueChange={(orders) =>
                  setFields({
                    ...fields,
                    warehouse: {
                      ...fields.warehouse,
                      options: { ...fields.warehouse.options, orders },
                    },
                  })
                }
                disabled={isLoading}
              />
              <Label text="can deliver orders" className="capitalize" htmlFor="canOrders" />
            </div>
            {/*  */}
            <div className="col-span-3 flex items-center gap-x-1">
              <Checkbox
                id="canPickups"
                value={fields.warehouse.options.pickups}
                onValueChange={(pickups) =>
                  setFields({
                    ...fields,
                    warehouse: {
                      ...fields.warehouse,
                      options: { ...fields.warehouse.options, pickups },
                    },
                  })
                }
                disabled={isLoading}
              />
              <Label text="can perform pickups" className="capitalize" htmlFor="canPickups" />
            </div>
            {/*  */}
            <div className="col-span-3 flex items-center gap-x-1">
              <Checkbox
                id="canReturns"
                value={fields.warehouse.options.returns}
                onValueChange={(returns) =>
                  setFields({
                    ...fields,
                    warehouse: {
                      ...fields.warehouse,
                      options: { ...fields.warehouse.options, returns },
                    },
                  })
                }
                disabled={isLoading}
              />
              <Label text="can perform returns" className="capitalize" htmlFor="canReturns" />
            </div>
            {/*  */}
            {/*  */}
            <div className="col-span-3 flex items-center gap-x-1">
              <Checkbox
                id="canTransferIn"
                value={fields.warehouse.options.transfer_in}
                onValueChange={(transfer_in) =>
                  setFields({
                    ...fields,
                    warehouse: {
                      ...fields.warehouse,
                      options: { ...fields.warehouse.options, transfer_in },
                    },
                  })
                }
                disabled={isLoading}
              />
              <Label text="can receive transfer" className="capitalize" htmlFor="canTransferIn" />
            </div>
            {/*  */}
            {/*  */}
            <div className="col-span-3 flex items-center gap-x-1">
              <Checkbox
                id="canTransferOut"
                value={fields.warehouse.options.transfer_out}
                onValueChange={(transfer_out) =>
                  setFields({
                    ...fields,
                    warehouse: {
                      ...fields.warehouse,
                      options: { ...fields.warehouse.options, transfer_out },
                    },
                  })
                }
                disabled={isLoading}
              />
              <Label text="can send transfer" className="capitalize" htmlFor="canTransferOut" />
            </div>
            {/*  */}
            {/*  */}
            <div className="col-span-3 flex items-center gap-x-1">
              <Checkbox
                id="lockTransferItems"
                value={fields.warehouse.options.lock_items}
                onValueChange={(lock_items) =>
                  setFields({
                    ...fields,
                    warehouse: {
                      ...fields.warehouse,
                      options: { ...fields.warehouse.options, lock_items },
                    },
                  })
                }
                disabled={isLoading}
              />
              <Label
                text="lock transfer items"
                className="capitalize"
                htmlFor="lockTransferItems"
              />
            </div>
            {/*  */}
            <div></div>
            {/*  */}
            <div className="mt-5 col-span-3">
              <Button label="Create Warehouse" isLoading={isLoading} onClick={handleSubmit} />
            </div>
            {/*  */}
          </div>
        </div>
      </div>
    </Drawer>
  );
};
