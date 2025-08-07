import { useState } from "react";
import { Drawer, Tooltip } from "@mui/material";
import { useToast } from "../../hooks/useToast";
import { useBackClose } from "./LastLocation";
import { Label } from "./Label";
import { Button, IconButton } from "./Button";
import { AutocompleteInput, Checkbox, Input } from "./Input";
import { xFetch } from "../../utils/constants";
import { cl } from "../../utils/misc";
import { AutoSmsContentInput } from "./AutoSmsContentInput";

const blank_fields = {
  model: "orders",
  status: "",
  content: "",
  active: true,
};

export const AddAutoSms = ({ ...props }) => {
  const [fields, setFields] = useState(blank_fields);
  const [isLoading, setLoading] = useState(false);

  const showToast = useToast();
  const onClose = useBackClose("/auto-sms");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await xFetch("/auto_sms", { method: "POST", body: fields });

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
            {"Create Auto SMS"}
          </span>
        </div>
        {/*  */}
        <div className="pb-10">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-x-3 gap-y-5">
              {/*  */}
              <div className="col-span-2">
                <Label text={"Model"} />
                <Input defaultValue={fields.model} disabled readOnly />
              </div>
              {/*  */}
              <div className="col-span-2">
                <Label text={"Status"} />
                <AutocompleteInput
                  value={fields.status}
                  inputProps={{ placeholder: "Status" }}
                  onValueChange={(status) => setFields({ ...fields, status })}
                  disabled={isLoading}
                  required
                  displayArrows
                  options={[
                    "draft",
                    "pending",
                    "problem",
                    "awaiting transfer",
                    "in progress",
                    "fulfilled",
                    "cancelled",
                  ]}
                />
              </div>
              {/*  */}
              <div className="col-span-2">
                <Label text={"Content"} />
                <AutoSmsContentInput
                  value={fields.content}
                  onValueChange={(content) => setFields({ ...fields, content })}
                  disabled={isLoading}
                  required
                />
              </div>
              {/*  */}
              <div className="col-span-2 flex items-center gap-x-3">
                <Checkbox
                  id="isEnabled"
                  value={fields.active}
                  onValueChange={(active) =>
                    setFields({
                      ...fields,
                      active,
                    })
                  }
                  disabled={isLoading}
                />
                <label className="text-gray-500" htmlFor="isEnabled">
                  Enabled
                </label>
              </div>
              {/*  */}
              <div className="mt-5 col-span-2">
                <Button btnColor="primary" label="Create" type="submit" isLoading={isLoading} />
              </div>
            </div>
          </form>
        </div>
      </div>
    </Drawer>
  );
};
