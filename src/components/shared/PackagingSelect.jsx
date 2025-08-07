import { Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { cl } from "../../utils/misc";
import { PackagingInput } from "./PackagingInput";

export const PackagingSelect = ({
  value,
  onChange,
  disabled,
  canEdit = false,
  target_city = "",
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  // const []

  const handleClick = (event) => {
    if (!canEdit || disabled) return;
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <span
        className={cl(
          "col-span-4 h-8 w-max px-2 rounded-full flex gap-x-2 items-center justify-center bg-blue-50 border border-solid border-blue-100 text-blue-800",
          { "cursor-pointer hover:shadow-sm": canEdit }
        )}
        onClick={handleClick}>
        <i className="fas fa-box-open"></i>
        emballage:
        <span className="uppercase font-bold">{value || "-"}</span>
        {canEdit && <i className="ml-4 fas fa-pen"></i>}
      </span>
      <Menu
        anchorEl={anchorEl}
        keepMounted={false}
        open={Boolean(anchorEl)}
        autoFocus={false}
        onClose={handleClose}>
        <div className="px-2">
          <PackagingInput
            value={value}
            onValueChange={(newvalue) => {
              if (newvalue !== value) {
                onChange?.(newvalue || "");
                if (newvalue) handleClose();
              }
            }}
            target_city={target_city}
          />
        </div>
      </Menu>
    </>
  );
};
