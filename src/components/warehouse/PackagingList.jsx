import { useState } from "react";
import { IconButton } from "../shared/Button";

export const PackagingList = ({ packaging, disabled = false, onChange }) => {
  return (
    <div>
      <h1>Packaging Fee</h1>
      <table className="col-span-4 p-2 rounded-t-lg m-5 w-full mx-auto bg-gray-200 text-gray-800">
        <tbody>
          <tr className="text-left border-b-2 border-gray-300">
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">frais (mad/article)</th>
            <th className="px-4 py-3"></th>
          </tr>
          {/*  DEFAULT */}
          {(packaging.conditions || []).map((condition) => (
            <TypeRow
              key={condition._id}
              condition={condition}
              onChange={(edited_condition) =>
                onChange({
                  ...packaging,
                  conditions: packaging.conditions?.map((saved_condition) => {
                    if (condition._id === saved_condition._id) return edited_condition;
                    return saved_condition;
                  }),
                })
              }
              onDelete={() =>
                onChange({
                  ...packaging,
                  conditions: packaging.conditions?.filter(
                    (saved_condition) => saved_condition._id !== condition._id
                  ),
                })
              }
            />
          ))}
          <AddType
            disabled={disabled}
            onAdd={(condition) =>
              onChange({ ...packaging, conditions: [...(packaging.conditions || []), condition] })
            }
          />
        </tbody>
      </table>
    </div>
  );
};

function TypeRow({ condition, disabled, onChange, onDelete }) {
  return (
    <tr className="bg-gray-100 border-b border-gray-200">
      <td className="px-4 py-3">
        <input
          role="presentation"
          autoComplete="off"
          placeholder="type"
          value={condition.type}
          onChange={(e) => {
            onChange({ ...condition, type: e.target.value });
          }}
          className="border-0 px-3  placeholder-gray-300 text-gray-600 bg-white rounded-full text-lg font-bold shadow hover:shadow-md transition-shadow duration-200 outline-none"
          disabled={disabled}
        />
      </td>
      <td className="px-4 py-3">
        <input
          role="presentation"
          autoComplete="off"
          type="tel"
          pattern="[0-9]*"
          placeholder="0"
          value={condition.fee}
          onChange={(e) => {
            if (!e.target.validity.valid && !!e.target.value) return;
            onChange({
              ...condition,
              fee: e.target.value,
            });
          }}
          className="border-0 px-3 w-16 placeholder-gray-300 text-gray-600 bg-white rounded-full text-lg font-bold shadow hover:shadow-md transition-shadow duration-200 outline-none"
          disabled={disabled}
        />
      </td>
      <td className="p-3 flex items-center justify-end">
        <IconButton icon="minus" onClick={onDelete} disabled={disabled} />
      </td>
    </tr>
  );
}

function AddType({ onAdd, disabled }) {
  function blankFields() {
    return { _id: `~package_fee-${Date.now()}`, type: "", fee: 0 };
  }

  const [fields, setFields] = useState(blankFields());

  function handleAdd() {
    if (!fields.type) return;
    onAdd(fields);
    setFields(blankFields());
  }
  return (
    <tr className="bg-gray-50">
      <td className="px-4 py-3">
        <input
          role="presentation"
          autoComplete="off"
          placeholder="type"
          value={fields.type}
          onChange={(e) => {
            setFields({
              ...fields,
              type: e.target.value,
            });
          }}
          className="border-0 px-3  placeholder-gray-300 text-gray-600 bg-white rounded-full text-lg font-bold shadow hover:shadow-md transition-shadow duration-200 outline-none"
          disabled={disabled}
        />
      </td>
      <td className="px-4 py-3">
        <input
          role="presentation"
          autoComplete="off"
          type="tel"
          pattern="[0-9]*"
          placeholder="0"
          value={fields.fee}
          onChange={(e) => {
            if (!e.target.validity.valid && !!e.target.value) return;
            setFields({
              ...fields,
              fee: e.target.value,
            });
          }}
          className="border-0 px-3 w-16 placeholder-gray-300 text-gray-600 bg-white rounded-full text-lg font-bold shadow hover:shadow-md transition-shadow duration-200 outline-none"
          disabled={disabled}
        />
      </td>
      <td className="p-3 flex items-center justify-end">
        <IconButton icon="plus" onClick={handleAdd} disabled={disabled} />
      </td>
    </tr>
  );
}

/*
DEFAULT 
 <tr className="bg-gray-100 border-b border-gray-200">
            <td className="px-4 py-3 capitalize">
              <input
                defaultValue={"DEFAULT"}
                className="border-0 px-3 text-gray-600 bg-gray-50 rounded-full text-lg font-bold outline-none"
                disabled={true}
              />
            </td>
            <td className="px-4 py-3">
              <input
                role="presentation"
                autoComplete="off"
                type="tel"
                pattern="[0-9]*"
                placeholder="0"
                value={packaging._default}
                onChange={(e) => {
                  if (!e.target.validity.valid && !!e.target.value) return;
                  onChange({
                    ...packaging,
                    _default: e.target.value,
                  });
                }}
                className="border-0 px-3 w-16 placeholder-gray-300 text-gray-600 bg-white rounded-full text-lg font-bold shadow hover:shadow-md transition-shadow duration-200 outline-none"
                disabled={disabled}
              />
            </td>
            <td></td>
          </tr>
*/
