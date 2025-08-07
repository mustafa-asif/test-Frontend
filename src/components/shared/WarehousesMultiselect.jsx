import { Fragment, useState } from "react";
import { IconButton } from "./Button";
import { Input } from "./Input";
import { useConfirmation, useScan } from "./ToolsProvider";

export const WarehouseMultiselect = ({ value, onValueChange, ...props }) => {
  const [inputValue, setInputValue] = useState("");

  function handleKeyPress(e) {
    if (e.key !== "Enter") return;

    e.preventDefault();
    onValueChange?.([...new Set([...value, ...e.target.value.split(" ").flat()])]);
    setInputValue("");
  }

  return (
    <Fragment>
      <div className="flex items-center gap-x-3">
        <Input
          value={inputValue}
          placeholder="ID de l'entrepôt"
          onValueChange={setInputValue}
          onKeyPress={handleKeyPress}
          {...props}
        />
      </div>
      <ItemsDisplay value={value} onValueChange={onValueChange} disabled={props.disabled} />
    </Fragment>
  );
};

function ItemsDisplay({ value, onValueChange, disabled }) {
  const confirmAction = useConfirmation();

  function removeItem(id) {
    if (disabled) return;
    onValueChange(value.filter((value) => value !== id));
  }

  function clearAll() {
    if (disabled) return;
    onValueChange([]);
  }
  return (
    <div className="flex flex-wrap gap-2 my-2">
      {value.map((id) => (
        <div
          key={id}
          className="bg-green-100 border border-green-200 rounded-full p-2 flex justify-between items-center gap-x-3 cursor-default">
          {id}
          <div
            className="rounded-full bg-white hover:bg-gray-500 hover:text-white cursor-pointer w-5 h-5 flex items-center justify-center"
            onClick={() => confirmAction({ title: `Supprimer ${id}?`, onConfirm: () => removeItem(id) })}
            disabled={disabled}>
            <span className="pointer-events-none">&times;</span>
          </div>
        </div>
      ))}
      {value.length > 0 && (
        <div
          className="ml-3 rounded-full bg-gray-100 border-gray-200 hover:bg-gray-200 cursor-pointer w-10 h-10 flex items-center justify-center"
          onClick={() => confirmAction({ title: "Tout effacer?", onConfirm: clearAll })}
          disabled={disabled}>
          <span className="pointer-events-none">&times;</span>
        </div>
      )}
    </div>
  );
}
