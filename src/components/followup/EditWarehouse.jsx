import { Fragment, useState } from "react";
import lodash from "lodash";
import { useToast } from "../../hooks/useToast";
import { Label } from "../shared/Label";
import { Button, IconButton } from "../shared/Button";
import { Input, NumberInput } from "../shared/Input";
import { xFetch } from "../../utils/constants";
import { CityCombobox } from "../shared/CityCombobox";
import { getDifferences } from "../../utils/misc";
import { useTranslation } from "../../i18n/provider";

export const EditWarehouse = ({ document: user, handleDrawerClose, ...props }) => {
  const original_doc = getEditFields(user);
  const [fields, setFields] = useState(original_doc);
  const [isLoading, setLoading] = useState(false);

  const showToast = useToast();
  const tl = useTranslation();

  async function handleSave(e) {
    e.preventDefault();
    if (isLoading) return;
    let body = lodash.cloneDeep(fields);
    setLoading(true);

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

  return (
    <Fragment>
      <div className="mb-6">
        <IconButton icon="arrow-left" className="mr-2" onClick={handleDrawerClose} />
        <span className="text-gray-700 text-lg md:text-2xl uppercase font-semibold">
          {"Edit Warehouse User "}
          <span className="lowercase text-gray-500">{user._id}</span>
        </span>
      </div>
      <div className="pb-10">
        <div className="grid grid-cols-4 gap-3 sm:gap-3">
          {/*  */}
          <div className="col-span-2">
            <Label text={"User Name"} />
            <Input defaultValue={user.name} disabled />
          </div>
          {/*  */}
          <div className="col-span-2">
            <Label text={"User Phone"} />
            <NumberInput defaultValue={user.phone} disabled />
          </div>
          {/*  */}
          <div className="col-span-2">
            <Label text={"Warehouse Name"} />
            <Input defaultValue={user.warehouse.name} disabled />
          </div>
          {/*  */}
          <div className="col-span-2">
            <Label text={"Physical City Location"}></Label>
            <CityCombobox value={user.warehouse.city} onValueChange={() => {}} disabled />
          </div>

          <Label text={"Working Cities"}></Label>
          {user.warehouse.working_cities.map((city, i) => (
            <div
              key={`${city}~${i}~${"cit"}`}
              className="grid grid-cols-6 gap-x-1 col-span-4 gap-y-[5px] items-end">
              <div className="col-span-4">
                {/* <Label text="City" /> */}
                <CityCombobox
                  value={city}
                  onValueChange={() => {}}
                  getOptions={(cities) =>
                    cities
                      .filter((city) => !user.warehouse.working_cities.includes(city.name))
                      .map((city) => city.name)
                  }
                  disabled
                />
              </div>
              <div className="col-span-2">
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
          {/*  */}
          <div className="mt-5 col-span-4 flex flex-col gap-y-2">
            <Button
              label={tl("save_changes")}
              btnColor="secondary"
              isLoading={isLoading}
              onClick={handleSave}
            />
          </div>
          {/*  */}
        </div>
      </div>
    </Fragment>
  );
};

function getEditFields(user) {
  return {
    warehouse: {
      city_metadata: lodash.cloneDeep(user.warehouse.city_metadata) || {},
    },
  };
}
