import { Menu, MenuItem } from "@mui/material";
import { forwardRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "../../i18n/provider";
import { getColorConf, getIconConf } from "../../utils/styles";
import { Button } from "../shared/Button";
import { DelivererInput } from "./DelivererInput";
import { useDelivererOptions } from "./DelivererOptions";

export const ActionsMenuWO = ({
  _id,
  model,
  status,
  editDocument,
  deleteDocument,
  edit,
  draft,
  pending,
  refused,
  fulfilled,
  cancelled,
  remove,
  problem,
  history = true,
  requiresItems = [],
  opensMessages = [],
  products,
  target,
  skipItemsOnFulfill = false,
  isView = false,
  print,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { deliverer } = useDelivererOptions();

  const navigate = useHistory();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function editStatus(newStatus, confirmType = "confirm", ...args) {
    const changes = { status: newStatus };
    if (deliverer && status === "pending") changes["deliverer_id"] = deliverer._id;

    handleClose();
    let callback = undefined;
    if (requiresItems.includes(newStatus)) confirmType = "items";

    if (opensMessages.includes(newStatus)) {
      callback = () => navigate.push(`${isView ? "/view/" : "/"}${model}/${_id}/chat`);
    }

    if (target && model === "orders" && newStatus === "problem") {
      callback = () => {
        window.open(
          `https://wa.me/212${+target.phone}?text=Salam%20${target.name
          }%2C%0Am3akom%20livreur%20mn%20Livo.ma%2C%20momkin%20taslo%20bia%20f%20a9reb%20wa9t%203la%209bel%20la%20commande%20dialkom%2C%20Merci`,
          "_blank"
        );
      };
    }

    if (newStatus === "fulfilled" && skipItemsOnFulfill) {
      changes["items"] = [];
    }

    return editDocument(changes, confirmType, callback, ...args);
  }

  function deleteDoc() {
    handleClose();
    deleteDocument();
  }

  function handlePrint() {
    print([_id]);
    handleClose();
  }

  return (
    <>
      {/* <div
        className={`bg-gradient-to-r from-${getColorConf(model, status)} to-${getColorConf(
          model,
          status,
          "2"
        )} hover:from-${getColorConf(
          model,
          status,
          "2"
        )} hover:to-gray-600 rounded-full h-10 text-lg text-white flex items-center shadow-sm hover:shadow-md justify-center transition duration-300 cursor-pointer`}
        onClick={handleClick}>
        <i className={`fas ${getIconConf(model, status)}`}></i>
      </div> */}
      <Button btnColor="" className={"bg-" + getColorConf(model, status)} onClick={handleClick}>
        <i className={`fas ${getIconConf(model, status)} text-white`}></i>
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        autoFocus={false}
        onClose={handleClose}>
        {status === "pending" && (
          <MenuItem component={"div"} disableGutters disableRipple divider>
            <DelivererInput />
          </MenuItem>
        )}
        {pending && (
          <ActionMenuItem model={model} status="pending" onClick={() => editStatus("pending")} />
        )}
        {edit && (
          <ActionMenuItem
            model={model}
            status="edit"
            component={Link}
            to={isView ? "/view/" : "/" + model + "/" + _id + "/edit"}
            icon="fa-pen"
            color="gray-500"
            onClick={handleClose}
          />
        )}
        {fulfilled && (
          <ActionMenuItem
            model={model}
            status="fulfilled"
            onClick={() =>
              editStatus(
                "fulfilled",
                ["orders", "pickups"].includes(model) && !skipItemsOnFulfill ? "items" : undefined,
                {
                  fetchDocument: false,
                  products: model === "orders" ? products : undefined,
                }
              )
            }
          />
        )}
        {refused && (
          <ActionMenuItem
            model={model}
            status="refused"
            onClick={() =>
              editStatus(
                "refused",
                ["orders", "pickups"].includes(model) && status !== "in progress"
                  ? "items"
                  : undefined,
                {
                  fetchDocument: false,
                  products: model === "orders" ? products : undefined,
                }
              )
            }
          />
        )}
        {cancelled && (
          <ActionMenuItem
            model={model}
            status="cancelled"
            onClick={() => editStatus("cancelled")}
          />
        )}
        {draft && (
          <ActionMenuItem
            model={model}
            status="draft"
            onClick={() => editStatus("draft")}
            icon="fa-undo-alt"
            color="gray-500"
          />
        )}
        {remove && (
          <ActionMenuItem
            model={model}
            status="remove"
            onClick={deleteDoc}
            icon="fa-trash"
            color="red-500"
          />
        )}
        {problem && (
          <ActionMenuItem model={model} status="problem" onClick={() => editStatus("problem")} />
        )}
        {history && (
          <ActionMenuItem
            model={model}
            status="history"
            component={Link}
            to={`${isView ? "/view/" : "/"}${model}/${_id}/history`}
            icon="fa-history"
            onClick={handleClose}
            color="gray-600"
          />
        )}
        {print && (
          <ActionMenuItem
            status="Print Card"
            onClick={handlePrint}
            icon="fa-print"
            color="red-400"
          />
        )}
      </Menu>
    </>
  );
};

const ActionMenuItem = forwardRef((props, ref) => {
  const tl = useTranslation();
  return (
    <MenuItem ref={ref} component={"div"} {...props}>
      <span
        className={`text-${props.color || getColorConf(props.model, props.status)
          } capitalize font-bold`}>
        <i
          className={`fas ${props.icon || getIconConf(props.model, props.status)
            } w-4 mr-1 text-center`}></i>{" "}
        {tl(props.status)}
      </span>
    </MenuItem>
  );
});
