import { Menu, MenuItem } from "@mui/material";
import { Fragment, useMemo, useState, forwardRef } from "react";
import { useTranslation } from "../../i18n/provider";
import { getMenuDataFromMSR } from "../../utils/status_rules";
import { getColorConf, getIconConf } from "../../utils/styles";
import { useQuickEditor } from "./ToolsProvider";

export const MessageStatusMenu = ({ _id, model, status, role }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isSaving, editDocument, deleteDocument] = useQuickEditor(_id, model);

  const handleOpen = (event) => {
    if (isSaving) return;
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  async function handleStatus(status) {
    handleClose();
    if (isSaving) return;
    const changes = { status };
    let confirmType = "confirm";
    let args = [];

    if (status === "fulfilled" && ["orders", "pickups"].includes(model)) {
      confirmType = "items";
      args[0] = { fetchDocument: false };
    }

    if (status === "in progress" && ["transfers"].includes(model)) {
      confirmType = "items";
    }

    if (status === "fulfilling" && ["pickups"].includes(model)) {
      confirmType = "items";
      args[0] = { optional: true };
    }

    if (status === "remove") {
      return deleteDocument();
    }

    return editDocument(changes, confirmType, undefined, ...args);
  }

  const menu_items = useMemo(() => {
    return getMenuDataFromMSR(model, status, role);
  }, [model, status, role]);

  return (
    <Fragment>
      <div
        className={`bg-${getColorConf(
          model,
          status
        )} border-2 border-black/10 rounded-full h-12 w-12 text-lg text-white flex items-center shadow-sm hover:shadow-md justify-center transition duration-300 cursor-pointer`}
        onClick={handleOpen}
        disabled={isSaving}>
        <i className={`fas ${getIconConf(model, status)}`}></i>
      </div>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        keepMounted={false}
        autoFocus={false}
        onClose={handleClose}>
        {menu_items.map((option) => (
          <ActionMenuItem
            key={option}
            model={model}
            status={option}
            onClick={() => handleStatus(option)}
          />
        ))}
      </Menu>
    </Fragment>
  );
};

const ActionMenuItem = forwardRef((props, ref) => {
  const tl = useTranslation();

  return (
    <MenuItem ref={ref} component={"div"} {...props}>
      <span
        className={`text-${
          props.color || getColorConf(props.model, props.status)
        } capitalize font-bold`}>
        <i
          className={`fas ${
            props.icon || getIconConf(props.model, props.status)
          } w-4 mr-1 text-center`}></i>{" "}
        {tl(props.status)}
      </span>
    </MenuItem>
  );
});
