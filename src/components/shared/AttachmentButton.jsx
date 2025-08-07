import { Menu, MenuItem } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { cl } from "../../utils/misc";

export const AttachmentButton = ({ disabled, onSelect }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [audioAvailable, setAudioAvailable] = useState(false);

  useEffect(() => {
    if (
      !navigator?.userAgent?.includes("Mobile") &&
      !navigator?.userAgentData?.mobile &&
      !window.matchMedia?.("(max-width: 767px)")?.matches
    ) {
      setAudioAvailable(true);
    }
  }, []);

  const handleOpen = (event) => {
    if (disabled) return;
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <div
        className={cl(
          "bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-200 hover:to-gray-300 rounded-full h-12 w-12 text-lg text-blue-500 flex items-center shadow-sm justify-center transition duration-300 ",
          { "hover:shadow-md cursor-pointer": !disabled },
          { "pointer-events-none opacity-70": disabled }
        )}
        onClick={handleOpen}
        disabled={disabled}>
        <i className="fas fa-paperclip"></i>
      </div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        keepMounted={false}
        autoFocus={false}
        onClose={handleClose}>
        {audioAvailable && (
          <MenuItem onClick={() => onSelect("audio")}>
            <span className={`text-black capitalize`}>
              <i className={`fas fa-microphone w-4 mr-2 text-center`}></i>
              audio
            </span>
          </MenuItem>
        )}
        <MenuItem onClick={() => onSelect("image")}>
          <span className={`text-black capitalize`}>
            <i className={`fas fa-image w-4 mr-2 text-center`}></i>
            image
          </span>
        </MenuItem>
      </Menu>
    </Fragment>
  );
};
