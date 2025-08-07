import { useStoreState } from "easy-peasy";
import lodash from "lodash";
import { Fragment, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { useTranslation } from "../../i18n/provider";
import { xFetch } from "../../utils/constants";
import { getDifferences } from "../../utils/misc";
import { Button, IconButton } from "../shared/Button";
import { CityCombobox } from "../shared/CityCombobox";
import { FormDatePicker } from "../shared/FormDatePicker";
import { Input, NumberInput, Checkbox } from "../shared/Input";

export const EditPickup = ({ document: pickup, handleDrawerClose, ...props }) => {
  const original_doc = lodash.cloneDeep({
    target: pickup.target,
    desired_date: pickup.desired_date || "", // react move from uncontrolled to controlled (undefined)
    items_count: pickup.items_count,
    needs_packaging: pickup.needs_packaging,
  });
  const [fields, setFields] = useState(original_doc);
  const [isLoading, setLoading] = useState(false);

  const authRole = useStoreState(state => state.auth.user?.role);
  const showToast = useToast();
  const tl = useTranslation();

  async function handleSave(e) {
    e.preventDefault();
    const changes = getDifferences(original_doc, fields);
    console.log("changes ", changes);
    setLoading(true);
    const { error } = await xFetch(`/pickups/${pickup._id}`, { method: "PATCH", body: changes });
    setLoading(false);
    if (error) {
      return showToast(error, "error");
    }
    return showToast("success", "success");
  }

  return (
    <Fragment>
      <div className="mb-6">
        <IconButton icon="arrow-left" className="mr-2" onClick={handleDrawerClose} />
        <span className="text-gray-700 text-lg md:text-2xl uppercase font-semibold">
          {tl("edit_pickup")} <span className="lowercase text-gray-500">{pickup._id}</span>
        </span>
      </div>
      <div className="pb-10">
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/*  */}
            <div className="col-span-2">
              <label className="block mb-2 text-md font-medium text-gray-700 font-sans">{tl("city")}</label>
              <CityCombobox
                value={fields.target.city}
                onValueChange={city => setFields({ ...fields, target: { ...fields.target, city } })}
                required
                disabled={isLoading || pickup.status !== "pending"}
              />
            </div>
            {/*  */}
            {/*  */}
            <div className="col-span-2">
              <label className="block mb-2 text-md font-medium text-gray-700 font-sans">{tl("address")}</label>
              <Input
                value={fields.target.address}
                onValueChange={address => setFields({ ...fields, target: { ...fields.target, address } })}
                disabled={isLoading}
                required
              />
            </div>
            {/*  */}
            {/*  */}
            <div className="col-span-2">
              <label className="block mb-2 text-md font-medium text-gray-700 font-sans">{tl("name")}</label>
              <Input
                value={fields.target.name}
                onValueChange={name => setFields({ ...fields, target: { ...fields.target, name } })}
                disabled={isLoading}
                required
              />
            </div>
            {/*  */}
            {/*  */}
            <div className="col-span-2">
              <label className="block mb-2 text-md font-medium text-gray-700 font-sans">{tl("phone")}</label>
              <Input
                type="tel"
                pattern="[0-9]*"
                value={fields.target.phone}
                onChange={e => {
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
                {tl("desired_date") + " (" + tl("optional") + ")"}
              </label>
              <FormDatePicker
                value={fields.desired_date}
                onValueChange={desired_date => setFields({ ...fields, desired_date })}
                disabled={isLoading || pickup.status !== "pending"}
              />
            </div>
            {/*  */}

            <div className="col-span-2">
              <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                {tl("number_of_items")} ({tl("optional")})
              </label>
              <NumberInput
                value={fields.items_count}
                onValueChange={items_count => setFields({ ...fields, items_count })}
                disabled={isLoading || pickup.status !== "pending" || authRole !== "client"}
              />
            </div>

            <div className="col-span-2 flex items-center gap-x-3 mt-2">
              <Checkbox
                id="packaging"
                value={fields.needs_packaging}
                onValueChange={needs_packaging => setFields(fields => ({ ...fields, needs_packaging }))}
                disabled={
                  isLoading ||
                  (pickup.status === "pending" && authRole === "client") ||
                  (pickup.status === "pending" && !["followup", "warehouse"].includes(authRole))
                }
              />

              <label className="text-gray-500" htmlFor="packaging">
                {tl("needs packaging")}
              </label>
            </div>

            {/*  */}
            <div className="mt-5 col-span-2 md:col-span-4">
              <Button
                label={tl("save_changes")}
                btnColor="secondary"
                type="submit"
                icon="dolly"
                isLoading={isLoading}
              />
            </div>
            {/*  */}
          </div>
        </form>
      </div>
    </Fragment>
  );
};
