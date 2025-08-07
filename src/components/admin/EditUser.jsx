import { Fragment, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { IMG_GET_URL, xFetch } from "../../utils/constants";
import { Button, IconButton } from "../shared/Button";
import { Label } from "../shared/Label";
import { Checkbox, Input } from "../shared/Input";
import { useConfirmation } from "../shared/ToolsProvider";
import { getDifferences } from "../../utils/misc";
import { useTranslation } from "../../i18n/provider";
import { PackInput } from "./PackInput";
import { AccessRestrictions } from "./AccessRestrictions";
import { WarehouseRestrictions } from "./WarehouseRestrictions";
import { WarehousesCombobox } from "../shared/WarehousesCombobox";

export const EditUser = ({ document: user, handleDrawerClose, ...props }) => {
  const original_fields = {
    password: "",
    confirm_password: "",
    name: user.name,
    active: user.active,
    isMainUser: user.isMainUser,
    role_data: {
      tenant: { tenant_rate: user.tenant?.tenant_rate, pack: user.tenant?.pack || "" },
      followup: { options: { warehouses: user.followup?.options?.warehouses || [] } },
      warehouse: { options: { warehouses: user.warehouse?.options?.warehouses || [] } },
    },
    access_restrictions: {
      pages: user.access_restrictions?.pages || [],
      statuses: user.access_restrictions?.statuses || {},
    },
  };

  const [fields, setFields] = useState(original_fields);
  const [isLoading, setLoading] = useState(false);

  const confirmAction = useConfirmation();
  const showToast = useToast();
  const tl = useTranslation();

  async function handleSave(e) {
    e.preventDefault();
    const changes = getDifferences(original_fields, fields);
    console.log("changes, ", changes);

    if (changes.password && changes.password !== changes.confirm_password) {
      return showToast("Passwords do not match", "error");
    }

    delete changes.confirm_password;
    if (Object.keys(changes).length < 1) return;
    changes[user.role] = changes["role_data"]?.[user.role];
    delete changes["role_data"];
    setLoading(true);
    const { error } = await xFetch(`/users/${user._id}`, { method: "PATCH", body: changes });
    setLoading(false);
    if (error) {
      return showToast(error, "error");
    }

    setFields({ ...fields, password: "", confirm_password: "" });
    return showToast("success", "success");
  }

  return (
    <Fragment>
      <div className="mb-6">
        <IconButton icon="arrow-left" className="mr-2" onClick={handleDrawerClose} />
        <span className="text-gray-700 text-lg md:text-2xl uppercase font-semibold">
          {tl("edit_user")} <span className="lowercase text-gray-500">{user._id}</span>{" "}
        </span>
      </div>
      <div className="pb-10">
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="col-span-2">
              <Label text={tl("name")} />
              <Input defaultValue={fields.name}
                onValueChange={(name) => setFields({ ...fields, name })}
                disabled={isLoading}
              />
            </div>

            {/*  */}
            <div className="col-span-2">
              <Label text={tl("role")} />
              <Input defaultValue={user.role} disabled />
            </div>

            {/*  */}
            <div className="col-span-2">
              <Label text={tl("phone")} />
              <Input defaultValue={user.phone} disabled />
            </div>

            {/*  */}
            <div className="col-span-2">
              <Label text={tl("email")} />
              <Input defaultValue={user.email} disabled />
            </div>
            {/*  */}
            <div className="col-span-2">
              <Label text={tl("government_id")} />
              <Input defaultValue={user.government_id} disabled />
            </div>
            {/*  */}
            <div className="col-span-2">
              <Label text="government_image" className="inline-flex mr-3 mb-2" />
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
              <Input defaultValue={user.government_image} disabled />
            </div>

            {/*  */}
            <div className="col-span-2">
              <Label text={tl("new_password")} />
              <Input
                value={fields.password}
                onValueChange={(password) => setFields({ ...fields, password })}
                disabled={isLoading}
                type="password"
              />
            </div>
            {/*  */}
            <div className="col-span-2">
              <Label text={tl("confirm_password")} />
              <Input
                value={fields.confirm_password}
                onValueChange={(confirm_password) => setFields({ ...fields, confirm_password })}
                disabled={isLoading}
                type="password"
              />
            </div>
            {user.role === "tenant" && (
              <Fragment>
                {/*  */}
                <div className="col-span-2">
                  <Label text={"Tenant Rate"} />
                  <Input
                    value={fields.role_data.tenant.tenant_rate}
                    onValueChange={(tenant_rate) =>
                      setFields((fields) => ({
                        ...fields,
                        role_data: {
                          ...fields.role_data,
                          tenant: { ...fields.role_data.tenant, tenant_rate },
                        },
                      }))
                    }
                    placeholder="5"
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label text={"Tenant Pack"} />
                  <PackInput
                    value={fields.role_data.tenant.pack}
                    onValueChange={(pack) =>
                      setFields((fields) => ({
                        ...fields,
                        role_data: {
                          ...fields.role_data,
                          tenant: { ...fields.role_data.tenant, pack },
                        },
                      }))
                    }
                    disabled={isLoading}
                    required
                  />
                </div>
                {/*  */}
              </Fragment>
            )}

            {["commercial", "followup", "payman"].includes(user.role) && (
              <div className="col-span-2 md:col-span-4 flex items-center gap-x-3">
                <Checkbox
                  id="isMainUser"
                  value={fields.isMainUser}
                  onValueChange={(isMainUser) => setFields({ ...fields, isMainUser })}
                  disabled={isLoading}
                />{" "}
                <Label
                  className="capitalize"
                  text={`main ${user.role} user`}
                  htmlFor="isMainUser"
                />
                <span className="ml-1 h-6 min-w-6 px-1 rounded-full bg-red-50 text-red-500 border border-solid border-red-100 flex items-center justify-center">
                  <i className="fas fa-crown"></i>
                </span>
              </div>
            )}

            {["warehouse", "followup", "payman"].includes(user.role) && (
              <div className="col-span-4 my-[10px]">
                <AccessRestrictions
                  role={user.role}
                  value={fields.access_restrictions}
                  onValueChange={(access_restrictions) =>
                    setFields({ ...fields, access_restrictions })
                  }
                  disabled={isLoading}
                />
              </div>
            )}

            {(user.role === "followup") && (
              <div className="col-span-4 my-[10px]">
                <WarehouseRestrictions warehouses={fields.role_data.followup?.options?.warehouses} setWarehouses={(warehouses) => setFields({ ...fields, role_data: { ...fields.role_data, followup: { ...fields.role_data.followup, options: { ...fields.role_data.followup.options, warehouses } } } })} />
              </div>
            )}

            {(user.role === "warehouse") && (
              <div className="col-span-4 my-[10px]">
                <WarehouseRestrictions warehouses={fields.role_data.warehouse?.options?.warehouses} setWarehouses={(warehouses) => setFields({ ...fields, role_data: { ...fields.role_data, warehouse: { ...fields.role_data.warehouse, options: { ...fields.role_data.warehouse.options, warehouses } } } })} />
              </div>
            )}

            <div className="col-span-2 md:col-span-4 flex items-center gap-x-3">
              <Checkbox
                id="isActive"
                value={fields.active}
                onValueChange={(active) => setFields({ ...fields, active })}
                disabled={isLoading}
              />{" "}
              <Label text="User Active" htmlFor="isActive" />
            </div>

            <div className="mt-5 col-span-2 md:col-span-4 flex flex-col gap-y-3">
              <Button
                label={tl("save_changes")}
                btnColor="secondary"
                type="button"
                isLoading={isLoading}
                onClick={handleSave}
                className="mb-1"
              />
            </div>
            {/*  */}
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export function imgSrc(string, transformations = "") {
  if (transformations) {
    transformations = "/" + transformations;
  }
  if (typeof string !== "string") return string;
  return IMG_GET_URL + transformations + "/v1647186950/" + string + ".png";
}
