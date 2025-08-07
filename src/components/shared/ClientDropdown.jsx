import { Menu, MenuItem } from "@mui/material";
import { useStoreState } from "easy-peasy";
import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { IconButton } from "./Button";
import { useTranslation } from "../../i18n/provider";

export const ClientDropdown = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const user = useStoreState((state) => state.auth.user);
  const brandName = user.client.brand.name.trim();
  const tl = useTranslation();

  const handleClick = (e) => {
    if (anchorEl) return handleClose();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <IconButton
        // image={user.client.brand.image}
        icon="user"
        iconColor="gray"
        onClick={handleClick}
      />
      <Menu
        className="mt-1"
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        onClose={handleClose}>
        <MenuItem component={Link} to="/account" onClick={handleClose} disabled={!brandName}>
          <div>
            <span className="text-green-500">{user.client.brand.name}</span>
            <span className="text-gray-500 block text-sm">{user.name}</span>
          </div>
        </MenuItem>

        <MenuItem component={Link} to="/account" onClick={handleClose} disabled={!brandName}>
          <i className="fas fa-cog mr-2"></i>
          {tl("settings")}
        </MenuItem>

        {user.isMainUser && user.client.referral?.enabled && (
          <MenuItem component={Link} to="/referrals" onClick={handleClose} disabled={!brandName}>
            <i className="fas fa-hand-holding-usd mr-2"></i>
            {tl("referrals")}
          </MenuItem>
        )}
        <MenuItem component={Link} to="/logout" onClick={handleClose}>
          <i className="fas fa-sign-out-alt mr-2"></i>
          {tl("logout")}
        </MenuItem>
      </Menu>
    </Fragment>
  );
};
