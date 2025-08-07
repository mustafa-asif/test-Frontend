import { Fragment, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { xFetch } from "../../utils/constants";
import { Button, IconButton } from "../shared/Button";
import { Label } from "../shared/Label";
import { Checkbox, Input } from "../shared/Input";
import { getDifferences } from "../../utils/misc";
import { MultipleCombobox } from "../shared/MultipleCombobox";
import common from "./common";

export const EditSupportCategory = ({ document: supportCategory, handleDrawerClose, ...props }) => {
  const original_fields = {
    category: supportCategory.category,
    sub_categories: supportCategory.sub_categories,
    active: supportCategory.active,
    target: {
      user_roles: supportCategory.target.user_roles,
      pages: supportCategory.target.pages,
    },
  };

  const [fields, setFields] = useState(original_fields);
  const [isLoading, setLoading] = useState(false);

  const showToast = useToast();

  async function handleSave(e) {
    e.preventDefault();
    const changes = getDifferences(original_fields, fields);
    console.log("changes, ", changes);

    if (Object.keys(changes).length < 1) return;
    setLoading(true);
    const { error } = await xFetch(`/supportCategories/${supportCategory._id}`, {
      method: "PATCH",
      body: changes,
    });
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
          Edit Support Category{" "}
          <span className="lowercase text-gray-500">{supportCategory._id}</span>{" "}
        </span>
      </div>
      <div className="pb-10">
        <form onSubmit={handleSave}>
          <div className="flex flex-col gap-x-3  gap-y-5">
            {/*  */}
            <div className="col-span-2">
              <Label category={"category"} />
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
                value={fields.sub_categories}
                onValueChange={(sub_categories) => setFields({ ...fields, sub_categories })}
                disabled={isLoading}
                placeholder="sub-categories"
                freeSolo
              />
            </div>

            {/*  */}
            {/* <div className="col-span-2">
              <Label text={"Target Roles (specific roles to show supportCategory)"} />
              <MultipleCombobox
                options={["client", "deliverer", "warehouse", "payman", "commercial", "followup", "admin"]}
                value={fields.target.user_roles}
                onValueChange={user_roles => setFields({ ...fields, target: { ...fields.target, user_roles } })}
                disabled={isLoading}
                placeholder="user roles"
                autoSelect
              />
            </div> */}
            {/*  */}

            {/*  */}
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
            <div className="mt-5 col-span-2 md:col-span-4 flex flex-col gap-y-3">
              <Button
                label="Save Changes"
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
