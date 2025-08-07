import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Checkbox, Input, NumberInput } from "../shared/Input";
import { Label } from "../shared/Label";
import { Button } from "../shared/Button";
import { CityCombobox } from "../shared/CityCombobox";
import { MultipleCombobox } from "../shared/MultipleCombobox";
import { getRandomString } from "../../utils/misc";

export function FeesConditions({ packOptions, subkey, value, onValueChange, disabled }) {
  function handleCellEdit({ field, value: fieldValue, id }) {
    onValueChange(
      value.map(value => {
        if (value._id === id) value[field] = fieldValue;
        return value;
      })
    );
  }
  return (
    <div className="col-span-2 border-b-2 border-t-2 border-gray-400 py-3">
      <b className="block mb-2 text-md text-gray-700 font-sans text-lg uppercase">{subkey}</b>
      <div style={{ maxHeight: 400, overflow: "auto" }} className="w-full my-2">
        <DataGrid
          headerHeight={40}
          rowHeight={40}
          disableColumnFilter
          disableColumnMenu
          hideFooter={value.length < 100}
          disableSelectionOnClick
          autoHeight
          rows={value}
          onCellEditCommit={handleCellEdit}
          getRowId={row => row._id}
          columns={[
            ...Object.keys(readConditionTypes[subkey]).map(field => ({
              field,
              headerName: field,
              editable: true,
              width: 125,
            })),
            { field: "fee", headerName: "fee", editable: true, width: 125 },
            {
              field: "action",
              headerName: " ",
              width: 50,
              renderCell: ({ id }) => {
                return (
                  <div className="flex-1 flex items-center justify-center">
                    <div
                      style={{ height: 30, width: 30 }}
                      className="flex items-center justify-center bg-red-500 rounded-full text-white
                              cursor-pointer shadow-sm hover:shadow-md"
                      onClick={() => {
                        onValueChange(value.filter(condition => condition._id !== id));
                      }}
                    >
                      <i className="fas fa-times"></i>
                    </div>
                  </div>
                );
              },
            },
          ]}
        />
      </div>
      <NewConditionForm
        subkey={subkey}
        onNewConditions={conditions => onValueChange([...value, ...conditions])}
        packOptions={packOptions}
      />
    </div>
  );
}

function NewConditionForm({ subkey, onNewConditions, packOptions = [] }) {
  const blank_fields = {
    fee: "",
    ...Object.keys(newConditionTypes[subkey]).reduce((object, key) => {
      if (newConditionTypes[subkey][key] === "strings") object[key] = [];
      else if (newConditionTypes[subkey][key] === "boolean") object[key] = false;
      else object[key] = "";
      return object;
    }, {}),
  };
  const [fields, setFields] = useState(blank_fields);

  function addCondition() {
    const packs = fields.packs?.includes("all") ? packOptions.filter(o => o !== "all") : fields.packs || [];

    const conditions = packs.map(pack => ({
      _id: `${subkey}-${getRandomString()}`,
      ...fields,
      packs: undefined,
      pack,
    }));

    onNewConditions(conditions);

    setFields(blank_fields);
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {Object.entries(newConditionTypes[subkey]).map(([field, type], i) => (
        <AppropriateInput
          key={`${subkey}-${field}`}
          label={field}
          type={type}
          value={fields[field]}
          onValueChange={value => setFields({ ...fields, [field]: value })}
          options={field === "packs" ? packOptions : []}
        />
      ))}
      <div className="col-span-3 flex gap-x-3">
        <div className="flex-1">
          <Label text="Fee" />
          <NumberInput value={fields.fee} onValueChange={fee => setFields({ ...fields, fee })} placeholder="0 DH" />
        </div>
        <div className="flex flex-1 items-end">
          <div className="w-full">
            <Button type="button" btnColor="blue" label="Add Condition" onClick={addCondition} />
          </div>
        </div>
      </div>
    </div>
  );
}

function AppropriateInput({ label, type, value, onValueChange, options }) {
  switch (type) {
    case "string":
      return (
        <div>
          <Label text={label} />
          <Input value={value} onValueChange={onValueChange} />
        </div>
      );
    case "strings":
      return (
        <div>
          <Label text={label} />
          <MultipleCombobox value={value} onValueChange={onValueChange} options={options || []} />
        </div>
      );
    case "city":
      return (
        <div>
          <Label text={label} />
          <CityCombobox value={value} onValueChange={onValueChange} />
        </div>
      );
    case "number":
      return (
        <div>
          <Label text={label} />
          <NumberInput value={value} onValueChange={onValueChange} />
        </div>
      );
    case "boolean":
      return (
        <div className="flex items-center gap-x-1">
          <Label className="" text={label} />
          <Checkbox value={value} onValueChange={onValueChange} />
        </div>
      );
    default:
      return <div>unknown input type: {type}</div>;
  }
}

const readConditionTypes = {
  order: {
    target_city: "city",
    warehouse_city: "city",
    pack: "string",
  },
  pickup: {
    target_city: "city",
    warehouse_city: "city",
    min_items: "number",
    max_items: "number",
    pack: "string",
  },
  transfer: {
    from_city: "city",
    to_city: "city",
    min_items: "number",
    max_items: "number",
    per_item: "boolean",
    pack: "string",
  },
  warehousing: {
    warehouse_city: "city",
    min_days: "number",
    max_days: "number",
    final: "boolean",
    pack: "string",
  },
  refusal: {
    target_city: "city",
    pack: "string",
  },
};

const newConditionTypes = {
  order: {
    target_city: "city",
    warehouse_city: "city",
    packs: "strings",
  },
  pickup: {
    target_city: "city",
    warehouse_city: "city",
    min_items: "number",
    max_items: "number",
    packs: "strings",
  },
  transfer: {
    from_city: "city",
    to_city: "city",
    min_items: "number",
    max_items: "number",
    per_item: "boolean",
    packs: "strings",
  },
  warehousing: {
    warehouse_city: "city",
    min_days: "number",
    max_days: "number",
    final: "boolean",
    packs: "strings",
  },
  refusal: {
    target_city: "city",
    packs: "strings",
  },
};
