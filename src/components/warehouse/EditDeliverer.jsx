import { Fragment, useState } from "react";
import { Button, IconButton } from "../shared/Button";
import lodash from "lodash";
import { Label } from "../shared/Label";
import { Checkbox, Input, NumberInput } from "../shared/Input";
import { FileInput } from "../shared/FileInput";
import { CityCombobox2 } from "../shared/CityCombobox";
import { ZoneCombobox } from "../shared/ZoneCombobox";
import { useConfirmation } from "../shared/ToolsProvider";
import { useToast } from "../../hooks/useToast";
import { imgSrc, xFetch } from "../../utils/constants";
import { xLogin } from "../../utils/auth";
import { getDifferences, xUploadImage } from "../../utils/misc";
import { useTranslation } from "../../i18n/provider";
import { useStoreState } from "easy-peasy";
import { Autocomplete, TextField } from "@mui/material";
import { sendSystemEvent } from "../../services/systemEvents";

export const EditDeliverer = ({ document: user, handleDrawerClose, ...props }) => {
  const isMainWarehouse = useStoreState((state) => state.auth.user.warehouse?.main);
  const currentUser = useStoreState((state) => state.auth.user);
  const canDeactivateDeliverer = !useStoreState((state) => state.auth.user.access_restrictions.pages?.includes("deactivate-deliverer"));
  const user_object = { ...lodash.cloneDeep(user), password: "" };
  const [fields, setFields] = useState(user_object);
  const [images, setImages] = useState({ image: null, government_image: null });
  const [isLoading, setLoading] = useState(false);

  const cityOptions = useStoreState((state) => state.auth.user.warehouse?.working_cities || []);

  const confirmAction = useConfirmation();
  const showToast = useToast();
  const tl = useTranslation();

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    let body = lodash.cloneDeep(fields);

    for (let key in images) {
      if (!images[key]) continue;
      const { data, error } = await xUploadImage(images[key]);
      if (error) showToast(`failed to upload ${key}`, "error");
      else body[key] = data;
    }

    const changes = getDifferences(user_object, body);
    console.log("changes ", changes);

    if (Object.keys(changes).length < 1) return setLoading(false);

    const { data, error } = await xFetch(`/users/${user._id}`, { method: "PATCH", body: changes });
    setLoading(false);

    if (error) return showToast(error, "error");

    if (changes.active === false) {
      await sendSystemEvent(currentUser, {
        type: 'deliverer_deactivated',
        timestamp: new Date().toISOString(),
        deliverer: {
          _id: user._id,
          name: user.name,
          phone: user.phone
        }
      });
    }

    showToast("success", "success");
  }

  async function loginAsDeliverer() {
    setLoading(true);
    const { data, error } = await xLogin({ phone: user_object.phone });
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
          {tl("edit_deliverer")} <span className="lowercase text-gray-500">{user._id}</span>
        </span>
      </div>
      <div className="pb-10">
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="col-span-2">
              <Label text={tl("full_name")} />
              <Input
                value={fields.name}
                onValueChange={(name) => setFields({ ...fields, name })}
                disabled={isLoading}
              />
            </div>
            {/*  */}
            {/*  */}
            <div className="col-span-2">
              <Label text={tl("phone")} />
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
            {/*  */}
            <div className="col-span-2">
              <Label text={tl("password")} />
              <Input
                type="password"
                value={fields.password}
                onValueChange={(password) => setFields({ ...fields, password })}
                disabled={isLoading}
              />
            </div>
            {/*  */}
            {/*  */}
            <div className="col-span-2">
              <Label text={tl("gov_id")} />
              <Input
                value={fields.government_id}
                onValueChange={(government_id) => setFields({ ...fields, government_id })}
                disabled={isLoading}
              />
            </div>
            {/*  */}
            {/*  */}
            {/* <div className="col-span-2">
              <Label text={tl("gov_image")} className="inline-flex mr-3 mb-2" />
              {user.government_image && (
                <span>
                  ({" "}
                  <a
                    className="text-blue-500 font-bold"
                    href={imgSrc(user.government_image)}
                    target="_blank"
                    rel="noreferrer">
                    <i className="fas fa-eye"></i> {tl("preview")}
                  </a>{" "}
                  )
                </span>
              )}
              <FileInput
                file={fields.government_image}
                setFile={(government_image) => setImages({ ...images, government_image })}
                disabled={isLoading}
              />
            </div> */}
            {/*  */}
            {/*  */}
            {/* <div className="col-span-2">
              <Label text={tl("profile_image") + " (Portrait)"} className="inline-flex mr-3 mb-2" />
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
                file={fields.image}
                setFile={(image) => setImages({ ...images, image })}
                disabled={isLoading}
              />
            </div> */}
            {/*  */}

            <div className="col-span-4">
              <Label text="Villes privilégiées" className="inline-flex mr-3 mb-2" />
              <Autocomplete
                options={cityOptions}
                value={fields.deliverer.options.cities}
                onChange={(e, val) => {
                  setFields({
                    ...fields,
                    deliverer: {
                      ...fields.deliverer,
                      options: { ...fields.deliverer.options, cities: val },
                    },
                  });
                }}
                // renderTags={(value, getTagProps) =>
                //   value.map((option, index) => <Chip variant="outlined" label={option.name} {...getTagProps({ index })} />)
                // }
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" placeholder="Ajouter Ville" />
                )}
                multiple
              />
            </div>

            {isMainWarehouse && (
              <div className="col-span-2 flex items-center gap-x-3 mt-2">
                <Checkbox
                  id="canPurge"
                  value={fields.deliverer.options.purges ?? false}
                  onValueChange={(purges) =>
                    setFields({
                      ...fields,
                      deliverer: {
                        ...fields.deliverer,
                        options: { ...fields.deliverer.options, purges },
                      },
                    })
                  }
                />
                <label className="text-gray-500" htmlFor="canPurge">
                  {tl("peut retourner articles")}
                </label>
              </div>
            )}

            {canDeactivateDeliverer && (
              <div className="col-span-2 flex items-center gap-x-3 mt-2">
                <Checkbox
                  id="isActive"
                  value={fields.active}
                  onValueChange={(active) =>
                    setFields({
                      ...fields,
                      active,
                    })
                  }
                />
                <label className="text-gray-500" htmlFor="isActive">
                  {tl("account_active")}
                </label>
              </div>
            )}

            <div className="mt-5 col-span-2 md:col-span-4 flex flex-col gap-y-3">
              <Button
                label={tl("save_changes")}
                btnColor="secondary"
                type="button"
                isLoading={isLoading}
                onClick={handleSave}
              />
              <Button
                icon="user"
                label={tl("login_as_deliverer")}
                type="button"
                disabled={isLoading}
                onClick={() =>
                  confirmAction({
                    title: `${tl("login_as_user")} ${user.name}`,
                    onConfirm: loginAsDeliverer,
                  })
                }
              />
            </div>
            {/*  */}
          </div>
        </form>
      </div>
    </Fragment>
  );
};
