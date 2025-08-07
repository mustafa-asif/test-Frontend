import { Fragment, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { imgSrc, xFetch } from "../../utils/constants";
import { Button, IconButton } from "../shared/Button";
import { Label } from "../shared/Label";
import { Input } from "../shared/Input";
import { getDifferences } from "../../utils/misc";
import { useTranslation } from "../../i18n/provider";
import { UserSelect } from "../shared/UserSelect";

export const EditClient = ({ document: user, handleDrawerClose, ...props }) => {
  const original_fields = {
    client: {
      assigned_followup: { _id: user.client.assigned_followup?._id || "" },
    },
  };

  const [fields, setFields] = useState(original_fields);
  const [isLoading, setLoading] = useState(false);

  const showToast = useToast();
  const tl = useTranslation();

  async function handleSave(e) {
    const changes = getDifferences(original_fields, fields);
    if (Object.keys(changes).length < 1) return;
    setLoading(true);
    const { error } = await xFetch(`/users/${user._id}`, { method: "PATCH", body: changes });
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
          {tl("edit_client")} <span className="lowercase text-gray-500">{user._id}</span>
        </span>
      </div>
      <div className="pb-10">
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/*  */}
            <div className="col-span-2">
              <Label text={tl("name")} />
              <Input defaultValue={user.name} disabled />
            </div>
            {/*  */}
            <div className="col-span-2">
              <Label text={tl("phone")} />
              <Input defaultValue={user.phone} disabled />
            </div>
            {/*  */}
            <div className="col-span-2">
              <Label text={tl("city")} />
              <Input defaultValue={user.client.location?.city} disabled />
            </div>
            {/*  */}
            <div className="col-span-2">
              <Label text={tl("address")} />
              <Input defaultValue={user.client.location?.address} disabled />
            </div>

            <div className="col-span-2">
              <Label text={tl("brand_name")} />
              <Input defaultValue={user.client.brand.name} disabled />
            </div>
            {/*  */}
            <div className="col-span-2">
              <Label text="Brand logo" className="inline-flex mr-3 mb-2" />
              {user.client.brand.image && (
                <span>
                  ({" "}
                  <a
                    className="text-blue-500 font-bold"
                    href={imgSrc(user.client.brand.image)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fas fa-eye"></i> {tl("preview")}
                  </a>{" "}
                  )
                </span>
              )}
              <Input defaultValue={user.client.brand.image} disabled />
            </div>
            {/*  */}
            <div className="col-span-2">
              <Label text="Assigned Followup" className="inline-flex mr-3 mb-2" />
              <UserSelect
                filters={["role=followup", "isMainUser=false"]}
                value={fields.client.assigned_followup?._id}
                onValueChange={_id =>
                  setFields({
                    ...fields,
                    client: {
                      ...fields.client,
                      assigned_followup: { ...fields.assigned_followup, _id },
                    },
                  })
                }
                disabled={isLoading}
              />
            </div>
            {/*  */}
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
