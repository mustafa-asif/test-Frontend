import { useState, useEffect } from "react";
import { Drawer } from "@mui/material";
import { useToast } from "../../hooks/useToast";
import { useBackClose } from "../shared/LastLocation";
import { Label } from "../shared/Label";
import { Button, IconButton } from "../shared/Button";
import { Checkbox, Input } from "../shared/Input";
import { xFetch } from "../../utils/constants";
import { MultipleCombobox } from "../shared/MultipleCombobox";
import { pages_list } from "../../utils/misc";

const blank_fields = {
  text: "",
  target: {
    user_roles: [],
    user_ids: [],
    page_paths: [],
  },
  active: true,
};

export const AddBanner = ({ ...props }) => {
  const [fields, setFields] = useState(blank_fields);
  const [isLoading, setLoading] = useState(false);

  const showToast = useToast();
  const onClose = useBackClose("/banners");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await xFetch("/banners", { method: "POST", body: fields });

    setLoading(false);
    if (error) {
      return showToast(error, "error");
    }
    setFields(blank_fields);
    return showToast("Success", "success");
  }

  return (
    <Drawer anchor="right" onClose={onClose} {...props}>
      <div className="w-screen sm:w-screen/1.5 h-full p-5 sm:p-10">
        {/*  */}
        <div className="mb-6">
          <IconButton icon="arrow-left" className="mr-3" iconColor="gray" onClick={onClose} />
          <span className="text-gray-700 text-lg md:text-2xl uppercase font-semibold">
            {"Create Banner"}
          </span>
        </div>
        {/*  */}
        <div className="pb-10">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-x-3  gap-y-5">
              {/*  */}
              <div className="col-span-2">
                <Label text={"Text Content"} />
                <Input
                  value={fields.text}
                  onValueChange={(text) => setFields((fields) => ({ ...fields, text }))}
                  disabled={isLoading}
                  placeholder="banner text content"
                />
              </div>
              {/*  */}
              <div className="col-span-2 flex flex-col gap-y-2 hidden">
                <Label text={"Target Roles (roles to show banner)"} />
                {/*  */}
                <div className="col-span-2 flex items-center gap-x-3">
                  <Checkbox
                    id="toClients"
                    value={fields.target.user_roles.includes("client")}
                    onValueChange={(checked) =>
                      setFields({
                        ...fields,
                        target: {
                          ...fields.target,
                          user_roles: checked
                            ? [...fields.target.user_roles, "client"]
                            : fields.target.user_roles.filter((role) => role !== "client"),
                        },
                      })
                    }
                    disabled={isLoading}
                  />
                  <label className="text-gray-500" htmlFor="toClients">
                    Clients
                  </label>
                </div>
                {/*  */}
                <div className="col-span-2 flex items-center gap-x-3">
                  <Checkbox
                    id="toDeliverers"
                    value={fields.target.user_roles.includes("deliverer")}
                    onValueChange={(checked) =>
                      setFields({
                        ...fields,
                        target: {
                          ...fields.target,
                          user_roles: checked
                            ? [...fields.target.user_roles, "deliverer"]
                            : fields.target.user_roles.filter((role) => role !== "deliverer"),
                        },
                      })
                    }
                    disabled={isLoading}
                  />
                  <label className="text-gray-500" htmlFor="toDeliverers">
                    Deliverers
                  </label>
                </div>
                {/*  */}
                <div className="col-span-2 flex items-center gap-x-3">
                  <Checkbox
                    id="toWarehouses"
                    value={fields.target.user_roles.includes("warehouse")}
                    onValueChange={(checked) =>
                      setFields({
                        ...fields,
                        target: {
                          ...fields.target,
                          user_roles: checked
                            ? [...fields.target.user_roles, "warehouse"]
                            : fields.target.user_roles.filter((role) => role !== "warehouse"),
                        },
                      })
                    }
                    disabled={isLoading}
                  />
                  <label className="text-gray-500" htmlFor="toWarehouses">
                    Warehouses
                  </label>
                </div>
                {/*  */}
                <div className="col-span-2 flex items-center gap-x-3">
                  <Checkbox
                    id="toFollowups"
                    value={fields.target.user_roles.includes("followup")}
                    onValueChange={(checked) =>
                      setFields({
                        ...fields,
                        target: {
                          ...fields.target,
                          user_roles: checked
                            ? [...fields.target.user_roles, "followup"]
                            : fields.target.user_roles.filter((role) => role !== "followup"),
                        },
                      })
                    }
                    disabled={isLoading}
                  />
                  <label className="text-gray-500" htmlFor="toFollowups">
                    Followups
                  </label>
                </div>
                {/*  */}
                <div className="col-span-2 flex items-center gap-x-3">
                  <Checkbox
                    id="toPaymans"
                    value={fields.target.user_roles.includes("payman")}
                    onValueChange={(checked) =>
                      setFields({
                        ...fields,
                        target: {
                          ...fields.target,
                          user_roles: checked
                            ? [...fields.target.user_roles, "payman"]
                            : fields.target.user_roles.filter((role) => role !== "payman"),
                        },
                      })
                    }
                    disabled={isLoading}
                  />
                  <label className="text-gray-500" htmlFor="toPaymans">
                    Paymans
                  </label>
                </div>
                {/*  */}
                <div className="col-span-2 flex items-center gap-x-3">
                  <Checkbox
                    id="toCommercials"
                    value={fields.target.user_roles.includes("commercial")}
                    onValueChange={(checked) =>
                      setFields({
                        ...fields,
                        target: {
                          ...fields.target,
                          user_roles: checked
                            ? [...fields.target.user_roles, "commercial"]
                            : fields.target.user_roles.filter((role) => role !== "commercial"),
                        },
                      })
                    }
                    disabled={isLoading}
                  />
                  <label className="text-gray-500" htmlFor="toCommercials">
                    Commercials
                  </label>
                </div>
              </div>
              {/*  */}
              <div className="col-span-2">
                <Label text={"Target Roles (specific roles to show banner)"} />
                <MultipleCombobox
                  options={[
                    "client",
                    "deliverer",
                    "warehouse",
                    "payman",
                    "commercial",
                    "followup",
                    "admin",
                  ]}
                  value={fields.target.user_roles}
                  onValueChange={(user_roles) =>
                    setFields({ ...fields, target: { ...fields.target, user_roles } })
                  }
                  disabled={isLoading}
                  placeholder="user roles"
                  autoSelect
                />
              </div>
              {/*  */}
              {/*  */}
              <div className="col-span-2">
                <Label text={"Target User IDs (specific users to show banner)"} />
                <MultipleCombobox
                  options={[]}
                  value={fields.target.user_ids}
                  onValueChange={(user_ids) =>
                    setFields({ ...fields, target: { ...fields.target, user_ids } })
                  }
                  disabled={isLoading}
                  placeholder="user ids"
                  freeSolo
                />
              </div>
              {/*  */}

              {/*  */}
              <div className="col-span-2">
                <Label text={"Target Pages (specific pages to show banner)"} />
                <MultipleCombobox
                  options={pages_list.sort()}
                  value={fields.target.page_paths}
                  onValueChange={(page_paths) =>
                    setFields({ ...fields, target: { ...fields.target, page_paths } })
                  }
                  disabled={isLoading}
                  placeholder="pages"
                  freeSolo
                />
              </div>
              {/*  */}

              <div className="col-span-2 flex items-center gap-x-3">
                <Checkbox
                  id="isActive"
                  value={fields.active}
                  onValueChange={(active) => setFields({ ...fields, active })}
                  disabled={isLoading}
                />
                <label className="text-gray-500" htmlFor="isActive">
                  Active
                </label>
              </div>
              {/*  */}
              <div className="mt-5 col-span-2">
                <Button btnColor="primary" label="Create" type="submit" isLoading={isLoading} />
              </div>
              {/*  */}
            </div>
          </form>
        </div>
      </div>
    </Drawer>
  );
};
