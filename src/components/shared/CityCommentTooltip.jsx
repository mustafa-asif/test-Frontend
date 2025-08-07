import { ClickAwayListener, styled } from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { useStoreState } from "easy-peasy";
import { useState } from "react";
import { cl } from "../../utils/misc";

const CustomizedTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#000",
    color: "#fff",
    fontSize: theme.typography.pxToRem(12),
    // border: "1px solid #dadde9",
  },
}));

export const CityCommentTooltip = ({ city }) => {
  const cities = useStoreState((state) => state.cities.cities);
  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  const warehouseComment = cities.find((ct) => ct.name === city)?.warehouseComment;

  if (!warehouseComment) return null;

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <div>
        <CustomizedTooltip
          PopperProps={{
            disablePortal: true,
          }}
          onClose={handleTooltipClose}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          slotProps={{
            popper: {
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, -14],
                  },
                },
              ],
            },
          }}
          title={<p>{warehouseComment}</p>}>
          <div className={cl("flex-wrap text-blue-800 cursor-pointer")} onClick={handleTooltipOpen}>
            <i className="fas fa-info-circle text-lg"></i>
          </div>
        </CustomizedTooltip>
      </div>
    </ClickAwayListener>
  );
};
