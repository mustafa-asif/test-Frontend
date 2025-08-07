import { Menu, MenuItem } from "@mui/material";
import { forwardRef, useState } from "react";

// const StyledMenuItem = styled((theme) => ({
//   root: {
//     minWidth: "3rem",
//     fontSize: "1rem",
//     fontWeight: "bold",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   },
// }))(MenuItem);

const StyledMenuItem = MenuItem;

export const ZoneMenu = ({ zone, options = [], onChange, disabled, can_edit_zones, style }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    if (disabled) return;
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (zone) => {
    handleClose();
    onChange(zone);
  };

  return (
    <>
      <span
        style={{ width: 42, height: 42, borderRadius: 21, minWidth: 42, minHeight: 42 }}
        className={`${!zone
          ? "bg-white border-2 border-dashed border-gray-300 text-xl text-gray-300 hover:bg-gray-100"
          : "bg-green-100 text-lg"
          } mr-2 flex items-center font-bold justify-center cursor-pointer uppercase ${style}`}
        onClick={handleClick}>
        {zone ? zone : <>?</>}
      </span>
      <Menu
        id="zones-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        {!!zone && <ZoneMenuItem key="x" onClick={() => handleSelect("")} disabled={disabled} />}
        {options.map((option) => (
          <ZoneMenuItem
            key={option}
            zone={option?.toUpperCase()}
            disabled={disabled || zone === option || can_edit_zones === false}
            onClick={() => handleSelect(option)}
          />
        ))}
        {options.length < 1 && <MenuItem disabled>Aucune zone</MenuItem>}
      </Menu>
    </>
  );
};

const ZoneMenuItem = forwardRef((props, ref) => {
  const { zone, ...rest } = props;
  return (
    <StyledMenuItem ref={ref} {...rest}>
      {zone ? zone : <span className="mx-auto text-2xl">&times;</span>}
    </StyledMenuItem>
  );
});
