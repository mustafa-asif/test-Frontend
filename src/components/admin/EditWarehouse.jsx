import { Fragment, useState } from "react";
import lodash from "lodash";
import { useToast } from "../../hooks/useToast";
import { Label } from "../shared/Label";
import { Button, IconButton } from "../shared/Button";
import { Checkbox, Input, NumberInput } from "../shared/Input";
import { imgSrc, JOBS_URL, xFetch } from "../../utils/constants";
import { FileInput } from "../shared/FileInput";
import { CityCombobox } from "../shared/CityCombobox";
import { getDifferences, xUploadImage, formatBankNumber } from "../../utils/misc";
import { xLogin } from "../../utils/auth";
import { useConfirmation } from "../shared/ToolsProvider";
import { useTranslation } from "../../i18n/provider";

export const EditWarehouse = ({ document: user, handleDrawerClose, ...props }) => {
  const original_doc = getEditFields(user);
  const [fields, setFields] = useState(original_doc);
  const [images, setImages] = useState({ image: null });
  const [isLoading, setLoading] = useState(false);

  const confirmAction = useConfirmation();
  const showToast = useToast();
  const tl = useTranslation();

  async function triggerTransferBack() {
    if (isLoading) return;
    setLoading(true);
    const { error } = await xFetch(
      `/runs/transfer_back`,
      {
        method: "POST",
      },
      false,
      JOBS_URL,
      [`from_warehouse_id=${user.warehouse._id}`]
    );
    setLoading(false);
    if (error) return showToast(error, "error");
    return showToast("success", "success");
  }

  async function handleSave(e) {
    e.preventDefault();
    if (isLoading) return;
    let body = lodash.cloneDeep(fields);
    setLoading(true);
    if (images.image) {
      const { data, error } = await xUploadImage(images.image);
      if (error) {
        setLoading(false);
        return showToast(error, "error");
      }
      body.image = data;
    }
    const changes = getDifferences(original_doc, body);
    console.log(changes);
    // return setLoading(false);
    if (Object.keys(changes).length < 1) return setLoading(false);
    const { data, error } = await xFetch(`/users/${user._id}`, {
      method: "PATCH",
      body: changes,
    });
    setLoading(false);
    if (error) {
      return showToast(error);
    }
    showToast("success", "success");
  }

  function addWorkingCity() {
    setFields((fields) => ({
      ...fields,
      warehouse: {
        ...fields.warehouse,
        working_cities: [...fields.warehouse.working_cities, ""],
        fees: {
          ...fields.warehouse.fees,
          warehouse: {
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
    }));
  }

  function removeWorkingCity(index) {
    setFields((fields) => ({
      ...fields,
      warehouse: {
        ...fields.warehouse,
        working_cities: fields.warehouse.working_cities.filter((_, i) => i !== index),
        city_metadata: {
          ...fields.warehouse.city_metadata,
          [fields.warehouse.working_cities[index]]: {},
        },
        fees: {
          ...fields.warehouse.fees,
          warehouse: {
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
    }));
  }

  function onWorkingCityChange(newCity, oldCity, index) {
    setFields((fields) => ({
      ...fields,
      warehouse: {
        ...fields.warehouse,
        city_metadata: {
          ...fields.warehouse.city_metadata,
          [newCity]: fields.warehouse.city_metadata[oldCity],
          [oldCity]: undefined,
        },
        working_cities: fields.warehouse.working_cities.map((city, i) => {
          if (city === oldCity && index === i) return newCity;
          return city;
        }),
        fees: {
          ...fields.warehouse.fees,
          warehouse: {
            order: {
              cities: fields.warehouse.fees.warehouse.order.cities.map((fee, i) => {
                if (fee.city === oldCity && index === i) fee.city = newCity;
                return fee;
              }),
            },
            pickup: {
              cities: fields.warehouse.fees.warehouse.pickup.cities.map((fee, i) => {
                if (fee.city === oldCity && index === i) fee.city = newCity;
                return fee;
              }),
            },
            refusal: {
              cities: fields.warehouse.fees.warehouse.refusal.cities.map((fee, i) => {
                if (fee.city === oldCity && index === i) fee.city = newCity;
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

  async function loginAsWarehouse() {
    setLoading(true);
    const { data, error } = await xLogin({ phone: original_doc.phone });
    setLoading(false);
    if (error) return showToast(error, "error");
    else if (data) {
      window.location.replace("/orders");
    }
  }
  return (
    <Fragment>
      <div className="mb-6">
        <IconButton icon="arrow-left" className="mr-2" onClick={handleDrawerClose} />
        <span className="text-gray-700 text-lg md:text-2xl uppercase font-semibold">
          {"Edit Warehouse User"}
          <span className="lowercase text-gray-500">{user._id}</span>
        </span>
      </div>
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
            <Label text="Profile Image" className="inline-flex mr-3 mb-2" />
            {user.image && (
              <span>
                ({" "}
                <a
                  className="text-blue-500 font-bold"
                  href={imgSrc(user.image)}
                  target="_blank"
                  rel="noreferrer">
                  <i className="fas fa-eye"></i> {tl("preview")}
                </a>{" "}
                )
              </span>
            )}
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
            <Label text={"Physical City Location"}></Label>
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
              className="grid grid-cols-6 gap-x-1 col-span-3 gap-y-[5px] items-end">
              <div className="col-span-2">
                {/* <Label text="City" /> */}
                <CityCombobox
                  value={city}
                  onValueChange={(newValue) => onWorkingCityChange(newValue, city, i)}
                  getOptions={(cities) =>
                    cities
                      .filter((city) => !fields.warehouse.working_cities.includes(city.name))
                      .map((city) => city.name)
                  }
                  disabled={isLoading}
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
                    {fee ? (
                      <NumberInput
                        value={fee.fee}
                        onValueChange={(newValue) => onFeeChange(newValue, subkey, fee._id)}
                        disabled={isLoading}
                      />
                    ) : (
                      <p className="text-gray-300"> Missing Fee for city {city}; add through api</p>
                    )}
                  </div>
                );
              })}
              <div className="h-full">
                <Label text="remove" className="invisible mb-3" />
                <div className="flex items-center justify-center">
                  <div
                    className="flex items-center h-10 w-10 justify-center bg-red-500 rounded-full text-white
                              cursor-pointer shadow-sm hover:shadow-md"
                    onClick={() => removeWorkingCity(i)}>
                    <i className="fas fa-times"></i>
                  </div>
                </div>
              </div>
              <div className="col-span-1">
                <Label text="Metadata Description" className="text-sm opacity-80 text-center" />
                <Input
                  placeholder="comment"
                  value={fields.warehouse.city_metadata[city]?.description}
                  onValueChange={(description) =>
                    setFields({
                      ...fields,
                      warehouse: {
                        ...fields.warehouse,
                        city_metadata: {
                          ...fields.warehouse.city_metadata,
                          [city]: { ...fields.warehouse.city_metadata?.[city], description },
                        },
                      },
                    })
                  }
                  disabled={isLoading}
                />
              </div>
            </div>
          ))}
          {/*  */}
          <div className="mb-10">
            <Button icon="plus" label="Add City" onClick={addWorkingCity} disabled={isLoading} />
          </div>
          {/*  */}
          <div className="col-span-3 flex items-center gap-x-1">
            <Checkbox
              id="isMain"
              value={fields.warehouse.main}
              onValueChange={(main) =>
                setFields({ ...fields, warehouse: { ...fields.warehouse, main } })
              }
              disabled={isLoading}
            />
            <Label text="warehouse is main" className="capitalize" htmlFor="isMain" />
          </div>
          {/*  */}
          <div className="col-span-3 flex items-center gap-x-1">
            <Checkbox
              id="isActive"
              value={fields.active}
              onValueChange={(active) => setFields({ ...fields, active })}
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
            <Label text="can deliverer orders" className="capitalize" htmlFor="canOrders" />
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
              id="lockItems"
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
            <Label text="lock transfer items" className="capitalize" htmlFor="lockItems" />
          </div>

          <div className="col-span-3 flex items-center gap-x-1">
            <Checkbox
              id="dispatch"
              value={fields.warehouse.dispatching?.active ?? true}
              onValueChange={(active) =>
                setFields({
                  ...fields,
                  warehouse: {
                    ...fields.warehouse,
                    dispatching: { ...fields.warehouse.dispatching, active },
                  },
                })
              }
              disabled={isLoading}
            />
            <Label text="Orders dispatching active" className="capitalize" htmlFor="dispatch" />
          </div>
          <div className="col-span-3 flex items-center gap-x-1">
            <Checkbox
              id="display_warehouse_deliverer_contact"
              value={fields.warehouse.options.display_warehouse_deliverer_contact}
              onValueChange={(display_warehouse_deliverer_contact) =>
                setFields({
                  ...fields,
                  warehouse: {
                    ...fields.warehouse,
                    options: { ...fields.warehouse.options, display_warehouse_deliverer_contact },
                  },
                })
              }
              disabled={isLoading}
            />
            <Label
              text="Display Warehouse/Deliverer Contact"
              className="capitalize"
              htmlFor="display_warehouse_deliverer_contact"
            />
          </div>
          <div className="col-span-3 flex items-center gap-x-1">
            <Checkbox
              id="display_client_team_member_contact"
              value={fields.warehouse.options.display_client_team_member_contact}
              onValueChange={(display_client_team_member_contact) =>
                setFields({
                  ...fields,
                  warehouse: {
                    ...fields.warehouse,
                    options: { ...fields.warehouse.options, display_client_team_member_contact },
                  },
                })
              }
              disabled={isLoading}
            />
            <Label
              text="Display Client/Team Member Contact"
              className="capitalize"
              htmlFor="display_client_team_member_contact"
            />
          </div>

          <div className="col-span-3 flex items-center gap-x-1">
            <Checkbox
              id="includeIntegration"
              value={!!fields.warehouse.integration?.system}
              onValueChange={(checked) =>
                setFields({
                  ...fields,
                  warehouse: {
                    ...fields.warehouse,
                    integration: checked ? { system: "elog", apiKey: "" } : { system: "" },
                  },
                })
              }
              disabled={isLoading}
            />
            <Label text="Include Integration" className="capitalize" htmlFor="includeIntegration" />
          </div>
          {fields.warehouse.integration?.system && (
            <div className="col-span-3 flex items-center gap-x-1">
              {/*  */}
              <input
                type="radio"
                className="hidden"
                checked={fields.warehouse.integration.system === "elog"}
                disabled={isLoading}
              />
              <label
                htmlFor="radio1"
                className="flex items-center cursor-pointer mr-3"
                onClick={() => {
                  if (isLoading || fields.warehouse.integration.system === "elog") return;
                  setFields((fields) => ({
                    ...fields,
                    warehouse: {
                      ...fields.warehouse,
                      integration: { ...fields.warehouse.integration, system: "elog" },
                    },
                  }));
                }}>
                <span className="w-4 h-4 inline-block mr-2 border border-gray"></span>
                <i className="fas fa-warehouse pr-2"></i> Elog
              </label>
            </div>
          )}
          {fields.warehouse.integration?.system && (
            <div className="col-span-3">
              <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                {tl("integration api key")}
              </label>
              <Input
                value={fields.warehouse.integration.apiKey || ""}
                onValueChange={(apiKey) =>
                  setFields((fields) => ({
                    ...fields,
                    warehouse: {
                      ...fields.warehouse,
                      integration: { ...fields.warehouse.integration, apiKey },
                    },
                  }))
                }
                disabled={isLoading}
              />
            </div>
          )}
          {/*  */}
          <div className="mt-5 col-span-3 flex flex-col gap-y-2">
            <Button
              label={tl("save_changes")}
              btnColor="secondary"
              isLoading={isLoading}
              onClick={handleSave}
            />
            <Button
              icon="user"
              label="Login as Warehouse"
              type="button"
              disabled={isLoading}
              onClick={() =>
                confirmAction({ title: `Login as ${user.name}`, onConfirm: loginAsWarehouse })
              }
            />
            {/* <Button
              icon="arrow-right"
              label="Trigger Transfer Back"
              type="button"
              onClick={() =>
                confirmAction({ title: `Trigger Transfer Back`, onConfirm: triggerTransferBack })
              }
            /> */}
          </div>
          {/*  */}
        </div>
      </div>
    </Fragment>
  );
};

function getEditFields(user) {
  return {
    name: user.name,
    phone: user.phone,
    password: user.password,
    image: user.image,
    // government_id: "",
    warehouse: {
      name: user.warehouse.name,
      city: user.warehouse.city,
      main: user.warehouse.main,
      working_cities: lodash.cloneDeep(user.warehouse.working_cities),
      city_metadata: lodash.cloneDeep(user.warehouse.city_metadata) || {},
      options: lodash.cloneDeep(user.warehouse.options),
      bank: lodash.cloneDeep(user.warehouse.bank),
      fees: {
        warehouse: {
          order: { cities: lodash.cloneDeep(user.warehouse.fees.warehouse.order.cities) },
          pickup: { cities: lodash.cloneDeep(user.warehouse.fees.warehouse.pickup.cities) },
          refusal: { cities: lodash.cloneDeep(user.warehouse.fees.warehouse.refusal.cities) },
        },
      },
      dispatching: user.warehouse.dispatching,
      integration: user.warehouse.integration,
    },
    active: user.active,
  };
}
