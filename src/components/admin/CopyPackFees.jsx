import { Dialog } from "@mui/material";
import { useState } from "react";
import { Button } from "../shared/Button";
import { AutocompleteInput } from "../shared/Input";
import { PackInput } from "./PackInput";

export const CopyPackFees = ({ packOptions, handleDuplicatePack, ...props }) => {
  const [fields, setFields] = useState({ from: "", to: "" });

  function handleSubmit(e) {
    e.preventDefault();
    if (fields.from === fields.to) return;
    handleDuplicatePack(fields.from, fields.to);
    setFields({ from: "", to: "" });
  }

  return (
    <Dialog {...props}>
      <div className="p-3 flex flex-col gap-y-3">
        <p className="uppercase text-gray-500 text-sm font-semibold">Duplicate Pack Fees</p>
        {/*  */}
        <form className="flex flex-col gap-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="ml-1 text-sm text-gray-400">From Pack</label>
            <AutocompleteInput
              inputProps={{ placeholder: "From Pack" }}
              value={fields.from}
              onValueChange={(from) => setFields({ ...fields, from })}
              style={{ height: 35 }}
              options={packOptions}
              required
            />
          </div>
          <div>
            <label className="ml-1 text-sm text-gray-400">To Pack</label>
            <PackInput
              value={fields.to}
              onValueChange={(to) => setFields({ ...fields, to })}
              style={{ height: 35 }}
              freeSolo
              required
            />
          </div>
          <Button btnColor="blue" className="mt-3" type="submit">
            Duplicate
          </Button>
        </form>
      </div>

      {/*  */}
    </Dialog>
  );
};
