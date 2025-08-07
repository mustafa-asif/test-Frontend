import { Fragment, useState } from "react";
import { Button, IconButton } from "../shared/Button";
import lodash from "lodash";
import { Label } from "../shared/Label";
import { Input } from "../shared/Input";
import { FeesConditions } from "./FeesConditions";
import { xFetch } from "../../utils/constants";
import { getDifferences, getRandomString } from "../../utils/misc";
import { useToast } from "../../hooks/useToast";
import { TextField } from "@mui/material";
import { useTranslation } from "../../i18n/provider";
import { PackInput } from "./PackInput";
import { CopyPackFees } from "./CopyPackFees";

export const EditFees = ({ document: fees, handleDrawerClose, ...props }) => {
  const original_doc = lodash.cloneDeep(fees);
  const [fields, setFields] = useState(original_doc);
  const [isLoading, setLoading] = useState(false);
  const [duplicateOpen, setDuplicateOpen] = useState(false);

  const showToast = useToast();
  const tl = useTranslation();

  async function handleSave() {
    if (isLoading) return;
    const changes = getDifferences(original_doc, fields);
    if (Object.keys(changes).length < 1) return;
    setLoading(true);
    const { data, error } = await xFetch(`/fees/${fees._id}`, { method: "PATCH", body: changes });
    setLoading(false);
    if (error) {
      return showToast(error, "error");
    }
    showToast("Success", "success");
  }

  function handleDuplicatePack(from, to) {
    //  validate?

    function duplicateSubkey(conditions, subkey) {
      return [
        ...conditions,
        ...conditions
          .filter(condition => condition.pack === from)
          .map(condition => ({ ...condition, _id: `${subkey}-${getRandomString()}`, pack: to })),
      ];
    }

    setFields(fields => ({
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
    <Fragment>
      <div className="mb-6">
        <IconButton icon="arrow-left" className="mr-2" onClick={handleDrawerClose} />
        <span className="text-gray-700 text-lg md:text-2xl uppercase font-semibold">
          {"Edit Fees "}
          <span className="lowercase text-gray-500">{fees._id}</span>
        </span>
      </div>
      {/*  */}
      <div className="pb-10">
        <div className="grid grid-cols-2 gap-3 sm:gap-3">
          {/*  */}
          <div className="col-span-2">
            <Label text={tl("name")} />
            <Input value={fields.name} onValueChange={name => setFields({ ...fields, name })} disabled={isLoading} />
          </div>
          {/*  */}
          <div className="col-span-2">
            <Label text={"Packs"} />
            <PackInput
              value={fields.packs}
              onValueChange={packs => setFields({ ...fields, packs })}
              renderInput={params => <TextField {...params} variant="standard" placeholder="Packs" />}
              disabled={isLoading}
              freeSolo
              multiple
            />
            <div className="mt-2 col-span-1">
              <p
                className="w-max ml-auto text-sm text-blue-400 hover:text-blue-600 cursor-pointer"
                onClick={() => setDuplicateOpen(true)}
              >
                Duplicate a pack's fees <i className="fas fa-copy"></i>
              </p>
            </div>
          </div>
          {/*  */}
          {["order", "pickup", "transfer", "warehousing", "refusal"].map(subkey => (
            <FeesConditions
              key={subkey}
              subkey={subkey}
              value={fields[subkey].conditions}
              onValueChange={conditions => setFields({ ...fields, [subkey]: { ...fields[subkey], conditions } })}
              disabled={isLoading}
              packOptions={fields.packs.length > 0 ? ["all", ...fields.packs] : []}
            />
          ))}
          {/*  */}
          <div className="mt-5 col-span-2">
            <Button label={tl("save_changes")} btnColor="secondary" isLoading={isLoading} onClick={handleSave} />
          </div>
          {/*  */}
        </div>
      </div>
      <CopyPackFees
        handleDuplicatePack={handleDuplicatePack}
        packOptions={fields.packs}
        open={duplicateOpen}
        onClose={() => setDuplicateOpen(false)}
      />
    </Fragment>
  );
};
