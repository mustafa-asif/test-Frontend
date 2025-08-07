import { useConfirmation } from "./ToolsProvider";
import { cl } from "../../utils/misc";
import { Fragment, useMemo, useState } from "react";

const allColors = ["red", "yellow", "green", "blue", "gray"];

export const Tags = ({ value = [], onChange, canRemove, canEdit, isLoading, className = "" }) => {
  const [isAdding, setAdding] = useState(false);
  const confirmAction = useConfirmation();

  const unusedColors = useMemo(
    () => allColors.filter((color) => !value.some((tag) => tag.color === color)),
    [value.map((val) => val.color).join("")]
  );

  function promptRemove(color) {
    if (isLoading || !canRemove || !canEdit) return;
    confirmAction({
      title: `Retirer tag '${color}'`,
      onConfirm: () => onChange(value.filter((val) => val.color !== color).map((tag) => tag.color)),
    });
  }

  function onNewTag(color) {
    if (isLoading || !canEdit) return;
    onChange([...value.map((val) => val.color), color]);
    setAdding(false);
  }

  return (
    <div className="flex gap-x-2 z-10">
      {value.map((tag) => (
        <span
          key={tag.color}
          className={cl("w-5 h-5 rounded-full", `bg-${tag.color}-500`, {
            "cursor-pointer hover:shadow-md": canRemove && !isLoading && canEdit,
          })}
          onClick={() => promptRemove(tag.color)}></span>
      ))}
      {canEdit && (
        <Fragment>
          <span
            className={cl(
              "w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center select-none",
              {
                "cursor-pointer hover:shadow-md": !isLoading,
                "cursor-default": isLoading,
              },
              className
            )}
            onClick={() => setAdding((isAdding) => !isAdding)}>
            {isAdding ? "x" : "+"}
          </span>
          {isAdding &&
            unusedColors.map((color) => (
              <span
                key={color}
                className={`w-5 h-5 rounded-full bg-${color}-500 cursor-pointer opacity-40 hover:opacity-100 hover:shadow-md`}
                onClick={() => onNewTag(color)}></span>
            ))}
        </Fragment>
      )}
    </div>
  );
};
