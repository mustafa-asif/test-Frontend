import { useState } from "react";
import { Drawer } from "@mui/material";
import { useToast } from "../../hooks/useToast";
import { useBackClose } from "../shared/LastLocation";
import { Label } from "../shared/Label";
import { Button, IconButton } from "../shared/Button";
import { Input } from "../shared/Input";
import { xFetch } from "../../utils/constants";
import { FeesConditions } from "./FeesConditions";
import { TextField } from "@mui/material";
import { PackInput } from "./PackInput";
import { CopyPackFees } from "./CopyPackFees";
import { getRandomString } from "../../utils/misc";

const blank_fields = {
  name: "",
  packs: [],
  refusal: {
    conditions: [],
  },
  pickup: {
    conditions: [],
  },
  order: {
    conditions: [],
  },
  transfer: {
    conditions: [],
  },
  warehousing: {
    conditions: [],
  },
};

export const AddFees = ({ ...props }) => {
  const [fields, setFields] = useState(blank_fields);
  const [isLoading, setLoading] = useState(false);
  const [isFetching, setFetching] = useState(false);
  const [duplicateOpen, setDuplicateOpen] = useState(false);
  const [sheetID, setSheetID] = useState("");

  const showToast = useToast();
  const onClose = useBackClose("/fees");

  async function handleSubmit(e) {
    e.preventDefault();
    if (isLoading) return;
    setLoading(true);
    const { error } = await xFetch(`/fees`, { method: "POST", body: fields });
    setLoading(false);
    if (error) {
      return showToast(error, "error");
    }
    setFields(blank_fields);
    showToast("success", "success");
  }

  async function fetchExcel() {
    if (!sheetID || isFetching || isLoading) return;
    setFetching(true);
    const { data, error } = await xFetch(`/fees/sheet-to-json`, undefined, undefined, undefined, [
      `sheet_id=${sheetID}`,
    ]);
    setFetching(false);
    if (error) {
      return showToast(error, "error");
    }

    setFields(formatFeesForInput(data));
  }

  function handleDuplicatePack(from, to) {
    //  validate?

    function duplicateSubkey(conditions, subkey) {
      return [
        ...conditions,
        ...conditions
          .filter((condition) => condition.pack === from)
          .map((condition) => ({ ...condition, _id: `${subkey}-${getRandomString()}`, pack: to })),
      ];
    }

    setFields((fields) => ({
      ...fields,
      packs: [...new Set([...fields.packs, to])],
      order: {
        conditions: duplicateSubkey(fields.order.conditions, "order"),
      },
      pickup: {
        conditions: duplicateSubkey(fields.pickup.conditions, "pickup"),
      },
      transfer: {
        conditions: duplicateSubkey(fields.transfer.conditions, "transfer"),
      },
      refusal: {
        conditions: duplicateSubkey(fields.refusal.conditions, "refusal"),
      },
      warehousing: {
        conditions: duplicateSubkey(fields.warehousing.conditions, "warehousing"),
      },
    }));

    setDuplicateOpen(false);
  }

  return (
    <Drawer anchor="right" onClose={onClose} {...props}>
      <div className="w-screen sm:w-screen/1.5 h-full p-5 sm:p-10">
        {/*  */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <IconButton icon="arrow-left" className="mr-3" iconColor="gray" onClick={onClose} />
            <span className="text-gray-700 text-lg md:text-2xl uppercase font-semibold">
              {"Create Fees"}
            </span>
          </div>
          <div className="flex items-center gap-x-2" style={{ maxWidth: 230 }}>
            <Input
              placeholder="Sheet ID"
              disabled={isLoading || isFetching}
              value={sheetID}
              onValueChange={setSheetID}
            />
            <IconButton
              icon="sync"
              iconColor="blue"
              type="button"
              onClick={fetchExcel}
              loadAimation="animate-spin"
              isLoading={isFetching}
            />
          </div>
        </div>
        {/*  */}
        <div className="pb-10">
          <div className="grid grid-cols-2 gap-3 sm:gap-3">
            {/*  */}
            <div className="col-span-2">
              <Label text={"Name"} />
              <Input
                value={fields.name}
                onValueChange={(name) => setFields({ ...fields, name })}
                disabled={isLoading}
              />
            </div>
            {/*  */}
            <div className="col-span-2">
              <Label text={"Packs"} />
              <PackInput
                value={fields.packs}
                onValueChange={(packs) => setFields({ ...fields, packs })}
                renderInput={(params) => (
                  <TextField {...params} variant="standard" placeholder="Packs" />
                )}
                disabled={isLoading}
                freeSolo
                multiple
              />
              <div className="mt-2 col-span-1">
                <p
                  className="w-max ml-auto text-sm text-blue-400 hover:text-blue-600 cursor-pointer"
                  onClick={() => setDuplicateOpen(true)}>
                  Duplicate a pack's fees <i className="fas fa-copy"></i>
                </p>
              </div>
            </div>
            {/*  */}
            {["order", "pickup", "transfer", "warehousing", "refusal"].map((subkey) => (
              <FeesConditions
                key={subkey}
                subkey={subkey}
                value={fields[subkey].conditions}
                onValueChange={(conditions) => setFields({ ...fields, [subkey]: { conditions } })}
                disabled={isLoading}
                packOptions={fields.packs.length > 0 ? ["all", ...fields.packs] : []}
              />
            ))}
            {/*  */}
            <div className="mt-5 col-span-2">
              <Button
                label="Create Fees"
                btnColor="primary"
                isLoading={isLoading}
                onClick={handleSubmit}
                disabled={isLoading || isFetching}
              />
            </div>
            {/*  */}
          </div>
        </div>
      </div>
      <CopyPackFees
        handleDuplicatePack={handleDuplicatePack}
        packOptions={fields.packs}
        open={duplicateOpen}
        onClose={() => setDuplicateOpen(false)}
      />
    </Drawer>
  );
};

function formatFeesForInput(fees) {
  return Object.keys(fees).reduce((formattedFees, key) => {
    if (Array.isArray(formattedFees[key].conditions)) {
      formattedFees[key].conditions = formattedFees[key].conditions.map((condition, i) => ({
        ...condition,
        _id: `${key}-${i}`,
      }));
    }
    return formattedFees;
  }, fees);
}
