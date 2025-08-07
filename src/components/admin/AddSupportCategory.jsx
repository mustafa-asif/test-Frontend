import { useState } from "react";
import { Drawer } from "@mui/material";
import { useToast } from "../../hooks/useToast";
import { useBackClose } from "../shared/LastLocation";
import { Label } from "../shared/Label";
import { Button, IconButton } from "../shared/Button";
import { Checkbox, Input } from "../shared/Input";
import { xFetch } from "../../utils/constants";
import { MultipleCombobox } from "../shared/MultipleCombobox";
import common from "./common";

const blank_fields = {
  category: "",
  sub_categories: [],
  target: {
    user_roles: [],
    pages: [],
  },
  active: true,
};

export const AddSupportCategory = ({ ...props }) => {
  const [fields, setFields] = useState(blank_fields);
  const [isLoading, setLoading] = useState(false);

  const showToast = useToast();
  const onClose = useBackClose("/support-categories");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await xFetch("/supportCategories", { method: "POST", body: fields });

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
            {"Create Support Category"}
          </span>
        </div>
        {/*  */}
        <div className="pb-10">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-x-3  gap-y-5">
              {/*  */}
              <div className="col-span-2">
                <Label text={"category"} />
                <Input
                  value={fields.category}
                  onValueChange={(category) => setFields((fields) => ({ ...fields, category }))}
                  disabled={isLoading}
                  placeholder="category"
                />
              </div>
              <div className="col-span-2">
                <Label text={"Add sub-categories"} />
                <MultipleCombobox
                  options={[]}
                  value={fields.target.sub_categories}
                  onValueChange={(sub_categories) => setFields({ ...fields, sub_categories })}
                  disabled={isLoading}
                  placeholder="sub-categories"
                  freeSolo
                />
              </div>
              {/* <div className="col-span-2">
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
              </div> */}

              <div className="col-span-2">
                <Label text={"Target Pages"} />
                <MultipleCombobox
                  options={common.allowedPages}
                  value={fields.target.pages}
                  onValueChange={(pages) =>
                    setFields({ ...fields, target: { ...fields.target, pages } })
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
