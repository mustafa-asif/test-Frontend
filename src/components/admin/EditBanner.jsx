import { Fragment, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { IMG_GET_URL, xFetch } from "../../utils/constants";
import { Button, IconButton } from "../shared/Button";
import { Label } from "../shared/Label";
import { Checkbox, Input } from "../shared/Input";
import { useConfirmation } from "../shared/ToolsProvider";
import { getDifferences, pages_list } from "../../utils/misc";
import { useTranslation } from "../../i18n/provider";
import { MultipleCombobox } from "../shared/MultipleCombobox";

export const EditBanner = ({ document: banner, handleDrawerClose, ...props }) => {
  const original_fields = {
    text: banner.text,
    active: banner.active,
    target: {
      user_roles: banner.target.user_roles,
      user_ids: banner.target.user_ids,
      page_paths: banner.target.page_paths,
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

    if (Object.keys(changes).length < 1) return;
    setLoading(true);
    const { error } = await xFetch(`/banners/${banner._id}`, { method: "PATCH", body: changes });
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
          Edit Banner <span className="lowercase text-gray-500">{banner._id}</span>{" "}
        </span>
      </div>
      <div className="pb-10">
        <form onSubmit={handleSave}>
          <div className="flex flex-col gap-x-3  gap-y-5">
            {/*  */}
            <div className="col-span-2">
              <Label text={"Text Content"} />
              <Input
                value={fields.text}
                onValueChange={text => setFields(fields => ({ ...fields, text }))}
                disabled={isLoading}
                placeholder="banner text content"
              />
            </div>

            {/*  */}
            <div className="col-span-2">
              <Label text={"Target Roles (specific roles to show banner)"} />
              <MultipleCombobox
                options={["client", "deliverer", "warehouse", "payman", "commercial", "followup", "admin"]}
                value={fields.target.user_roles}
                onValueChange={user_roles => setFields({ ...fields, target: { ...fields.target, user_roles } })}
                disabled={isLoading}
                placeholder="user roles"
                autoSelect
              />
            </div>
            {/*  */}
            {/*  */}
            <div className="col-span-2">
              <Label text={"Target User IDs"} />
              <MultipleCombobox
                options={[]}
                value={fields.target.user_ids}
                onValueChange={user_ids => setFields({ ...fields, target: { ...fields.target, user_ids } })}
                disabled={isLoading}
                placeholder="user ids"
                freeSolo
              />
            </div>
            {/*  */}
            {/*  */}
            <div className="col-span-2">
              <Label text={"Target Pages"} />
              <MultipleCombobox
                options={pages_list.sort()}
                value={fields.target.page_paths}
                onValueChange={page_paths => setFields({ ...fields, target: { ...fields.target, page_paths } })}
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
                onValueChange={active => setFields({ ...fields, active })}
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
