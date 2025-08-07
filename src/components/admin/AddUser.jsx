import { useState, useEffect, Fragment } from "react";
import { Drawer } from "@mui/material";
import { useToast } from "../../hooks/useToast";
import { useBackClose } from "../shared/LastLocation";
import { WarehousesCombobox } from "../shared/WarehousesCombobox";
import { ClientsCombobox } from "../shared/ClientsCombobox";
import { xAddPayment } from "../../utils/cycles";
import { Label } from "../shared/Label";
import { Tab } from "../shared/Tab";
import { Button, IconButton } from "../shared/Button";
import { AutocompleteInput, Checkbox, Input, NumberInput } from "../shared/Input";

import { xUploadFile } from "../../utils/misc";
import { xFetch } from "../../utils/constants";
import { FileInput } from "../shared/FileInput";
import { PackInput } from "./PackInput";
import { AccessRestrictions } from "./AccessRestrictions";

const blank_fields = {
  name: "",
  email: "",
  phone: "",
  government_id: "",
  government_image: "",
  role: "",
  password: "",
  confirm_password: "",
  active: true,
  role_data: {
    tenant: { title: "", domain: "", tenant_rate: 3, pack: "" },
    followup: {},
    commercial: {},
    warehouse: { _id: "" },
  },
  access_restrictions: {
    pages: [],
    statuses: {},
  },
};

export const AddUser = ({ ...props }) => {
  const [fields, setFields] = useState(blank_fields);
  const [isLoading, setLoading] = useState(false);

  const showToast = useToast();
  const onClose = useBackClose("/users");

  async function handleSubmit(e) {
    e.preventDefault();
    if (isLoading) return;

    if (fields.password !== fields.confirm_password) {
      return showToast("Passwords do not match", "error");
    }
    setLoading(true);

    const userData = {
      ...fields,
      [fields.role]: fields.role_data[fields.role],
      role_data: undefined,
      confirm_password: undefined,
    };

    if (fields.government_image) {
      const { data, error } = await xUploadFile(fields.government_image);

      if (error) {
        setLoading(false);
        showToast(error, "error");
        return;
      }
      userData["government_image"] = data;
    }

    const { data, error } = await xFetch("/users", { method: "POST", body: userData });

    setLoading(false);
    if (error) {
      return showToast(error, "error");
    }
    setFields({ ...blank_fields });
    return showToast("Success", "success");
  }

  return (
    <Drawer anchor="right" onClose={onClose} {...props}>
      <div className="w-screen sm:w-screen/1.5 h-full p-5 sm:p-10">
        {/*  */}
        <div className="mb-6">
          <IconButton icon="arrow-left" className="mr-3" iconColor="gray" onClick={onClose} />
          <span className="text-gray-700 text-lg md:text-2xl uppercase font-semibold">
            {"Create User"}
          </span>
        </div>
        {/*  */}
        <div className="pb-10">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3 sm:gap-3 md:grid-cols-4">
              {/*  */}
              <div className="col-span-2">
                <Label text={"Name"} />
                <Input
                  value={fields.name}
                  onValueChange={(name) => setFields((fields) => ({ ...fields, name }))}
                  disabled={isLoading}
                  required
                />
              </div>
              {/*  */}
              <div className="col-span-2">
                <Label text={"Role"} />
                <AutocompleteInput
                  value={fields.role}
                  onValueChange={(role) => setFields({ ...fields, role })}
                  disabled={isLoading}
                  options={["followup", "payman", "commercial", "tenant", "warehouse"]}
                  required
                />
              </div>
              {/*  */}
              <div className="col-span-2">
                <Label text={"Phone"} />
                <NumberInput
                  value={fields.phone}
                  onValueChange={(phone) => setFields((fields) => ({ ...fields, phone }))}
                  disabled={isLoading}
                  required
                />
              </div>
              {/*  */}
              <div className="col-span-2">
                <Label text={"Email"} />
                <Input
                  type="email"
                  value={fields.email}
                  onValueChange={(email) => setFields((fields) => ({ ...fields, email }))}
                  disabled={isLoading}
                />
              </div>
              {/*  */}
              <div className="col-span-2">
                <Label text={"Government ID"} />
                <Input
                  value={fields.government_id}
                  onValueChange={(government_id) =>
                    setFields((fields) => ({ ...fields, government_id }))
                  }
                  disabled={isLoading}
                />
              </div>
              {/*  */}
              <div className="col-span-2">
                <Label text={"Government Image"} />
                <FileInput
                  file={fields.government_image}
                  setFile={(government_image) => setFields({ ...fields, government_image })}
                  disabled={isLoading}
                />
              </div>
              {/*  */}
              <div className="col-span-2">
                <Label text={"Password"} />
                <Input
                  type="password"
                  value={fields.password}
                  onValueChange={(password) => setFields((fields) => ({ ...fields, password }))}
                  disabled={isLoading}
                  required
                />
              </div>
              {/*  */}
              <div className="col-span-2">
                <Label text={"Confirm Password"} />
                <Input
                  type="password"
                  value={fields.confirm_password}
                  onValueChange={(confirm_password) =>
                    setFields((fields) => ({ ...fields, confirm_password }))
                  }
                  disabled={isLoading}
                  required
                />
              </div>
              {/*  */}

              {fields.role === "tenant" && (
                <Fragment>
                  {/*  */}
                  <div className="col-span-2">
                    <Label text={"Site Title"} />
                    <Input
                      value={fields.role_data.tenant.title}
                      onValueChange={(title) =>
                        setFields((fields) => ({
                          ...fields,
                          role_data: {
                            ...fields.role_data,
                            tenant: { ...fields.role_data.tenant, title },
                          },
                        }))
                      }
                      disabled={isLoading}
                      required
                    />
                  </div>
                  {/*  */}
                  <div className="col-span-2">
                    <Label text={"Site Domain"} />
                    <Input
                      value={fields.role_data.tenant.domain}
                      onValueChange={(domain) =>
                        setFields((fields) => ({
                          ...fields,
                          role_data: {
                            ...fields.role_data,
                            tenant: { ...fields.role_data.tenant, domain },
                          },
                        }))
                      }
                      disabled={isLoading}
                      required
                    />
                  </div>
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
              {fields.role === "warehouse" && (
                <Fragment>
                  <div className="col-span-2">
                    <Label text={"Warehouse"} />
                    <WarehousesCombobox
                      value={fields.role_data.warehouse._id}
                      onValueChange={(_id) =>
                        setFields({
                          ...fields,
                          role_data: { ...fields.role_data, warehouse: { _id } },
                        })
                      }
                      disabled={isLoading}
                      required
                    />
                  </div>
                </Fragment>
              )}
              {(fields.role === "warehouse" || fields.role === "followup") && (
                <div className="col-span-4 my-[10px]">
                  <AccessRestrictions
                    value={fields.access_restrictions}
                    onValueChange={(access_restrictions) =>
                      setFields({ ...fields, access_restrictions })
                    }
                    disabled={isLoading}
                  />
                </div>
              )}
              <div className="col-span-2 flex items-center gap-x-3">
                <Checkbox
                  value={fields.active}
                  onValueChange={(active) => setFields({ ...fields, active })}
                />
                <Label text={"Active"} />
              </div>

              {/*  */}
              <div className="mt-5 col-span-4">
                <Button label="Create User" type="submit" isLoading={isLoading} />
              </div>
              {/*  */}
            </div>
          </form>
        </div>
      </div>
    </Drawer>
  );
};
