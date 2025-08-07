import { Drawer } from "@mui/material";
import { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { xFetch } from "../../utils/constants";
import { xAddPayment } from "../../utils/cycles";
import { xAddPickup } from "../../utils/pickups";
import { Button, IconButton } from "../shared/Button";
import { ClientsCombobox } from "../shared/ClientsCombobox";
import { Input, Checkbox } from "../shared/Input";
import { FileInput } from "../shared/FileInput";
import { useBackClose } from "../shared/LastLocation";
import { usePrint } from "../shared/ToolsProvider";
import { useStoreActions } from "easy-peasy";
import { Label } from "../shared/Label";

const blank_fields = {
  filename: "",
  description: "",
  file: "",
  isDefault: false,
  fromProduction: false,
};

export const AddSnapshot = ({ ...props }) => {
  const [fields, setFields] = useState(blank_fields);
  const [isLoading, setLoading] = useState(false);

  const showToast = useToast();
  const addSnapshot = useStoreActions((state) => state.snapshots.addSnapshot);
  const onClose = useBackClose("/snapshots");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    let body = new FormData();
    if (fields.file) {
      body.append("file", fields.file);
      body.append("filename", fields.filename);
      body.append("description", fields.description);
      body.append("isDefault", fields.isDefault + "");
    }

    const { error, data } = await xFetch(
      `/snapshots`,
      { method: "POST", body: fields.file ? body : fields },
      !!fields.file
    );
    setLoading(false);
    if (error) {
      return showToast(error, "error");
    }
    setFields(blank_fields);
    addSnapshot(data);
    return showToast("success", "success");
  }

  return (
    <Drawer anchor="right" onClose={onClose} {...props}>
      <div className="w-screen sm:w-screen/1.5 h-full p-5 sm:p-10">
        {/*  */}
        <div className="mb-6">
          <IconButton icon="arrow-left" className="mr-3" iconColor="gray" onClick={onClose} />
          <span className="text-gray-700 text-lg md:text-2xl uppercase font-semibold">
            {"Create Snapshot"}
          </span>
        </div>
        {/*  */}
        <div className="pb-10">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3 sm:gap-3">
              {/*  */}
              <div className="col-span-2">
                <Label text="Filename (default Date.now())" />
                <Input
                  value={fields.filename.replace(/\s/g, "")}
                  onValueChange={(filename) => setFields((fields) => ({ ...fields, filename }))}
                  disabled={isLoading}
                />
              </div>
              {/*  */}
              {/*  */}
              <div className="col-span-2">
                <Label text="Description" />
                <Input
                  value={fields.description}
                  onValueChange={(description) =>
                    setFields((fields) => ({ ...fields, description }))
                  }
                  disabled={isLoading}
                />
              </div>
              {/*  */}
              <div className="col-span-2">
                <Label text={"File Data"} />
                <FileInput
                  file={fields.file}
                  setFile={(file) => setFields({ ...fields, file })}
                  disabled={isLoading}
                />
              </div>
              {/*  */}
              {window.location.hostname.includes("staging") && (
                <div className="col-span-2 flex items-center gap-x-3">
                  <Checkbox
                    value={fields.fromProduction}
                    onValueChange={(fromProduction) => setFields({ ...fields, fromProduction })}
                  />
                  <label className="text-gray-500">From Production</label>
                </div>
              )}
              {/*  */}
              <div className="col-span-2 flex items-center gap-x-3">
                <Checkbox
                  value={fields.isDefault}
                  onValueChange={(isDefault) => setFields({ ...fields, isDefault })}
                />
                <label className="text-gray-500">Is Default</label>
              </div>
              {/*  */}
              <div className="mt-5 col-span-2">
                <Button label="Create Snapshot" type="submit" isLoading={isLoading} />
              </div>
              {/*  */}
            </div>
          </form>
        </div>
      </div>
    </Drawer>
  );
};
