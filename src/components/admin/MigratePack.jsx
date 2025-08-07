import { Drawer } from "@mui/material";
import { useState } from "react";
import { useToast } from "../../hooks/useToast";
import { xFetch } from "../../utils/constants";
import { Button, IconButton } from "../shared/Button";
import { useBackClose } from "../shared/LastLocation";
import { useConfirmation } from "../shared/ToolsProvider";
import { Label } from "../shared/Label";
import { PackInput } from "./PackInput";

const blank_fields = {
  from_pack: "",
  to_pack: "",
};

export const MigratePack = ({ ...props }) => {
  const [fields, setFields] = useState(blank_fields);
  const [isLoading, setLoading] = useState(false);

  const showToast = useToast();
  const onClose = useBackClose("/clients");
  const confirmAction = useConfirmation();

  function handleSubmit(e) {
    e.preventDefault();
    confirmAction({ title: "Are you sure?", onConfirm: makeMigration });
  }

  async function makeMigration() {
    setLoading(true);
    const { error, data } = await xFetch(`/alternatives/pack-migrate`, {
      method: "POST",
      body: fields,
    });
    setLoading(false);
    if (error) {
      return showToast(error, "error");
    }
    setFields(blank_fields);
    return showToast("success", "success");
  }

  return (
    <Drawer anchor="right" onClose={onClose} {...props}>
      <div className="w-screen sm:w-screen/1.5 h-full p-5 sm:p-10">
        {/*  */}
        <div className="mb-6">
          <IconButton icon="arrow-left" className="mr-3" iconColor="gray" onClick={onClose} />
          <span className="text-gray-700 text-lg md:text-2xl uppercase font-semibold">
            {"Migrate Packs"}
          </span>
        </div>
        {/*  */}
        <div className="pb-10">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3 sm:gap-3">
              {/*  */}
              <div className="col-span-2">
                <Label text="From Pack" />
                <PackInput
                  value={fields.from_pack}
                  onValueChange={(from_pack) => setFields({ ...fields, from_pack })}
                  disabled={isLoading}
                />
              </div>
              {/*  */}
              {/*  */}
              <div className="col-span-2">
                <Label text="To Pack" />
                <PackInput
                  value={fields.to_pack}
                  onValueChange={(to_pack) => setFields({ ...fields, to_pack })}
                  disabled={isLoading}
                />
              </div>
              {/*  */}
              <div className="mt-5 col-span-2">
                <Button label="Migrate Pack" type="submit" isLoading={isLoading} />
              </div>
              {/*  */}
              <p className="text-sm text-gray-400">WARNING: Procedure may take a while...</p>
            </div>
          </form>
        </div>
      </div>
    </Drawer>
  );
};
