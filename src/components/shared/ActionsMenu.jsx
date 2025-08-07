import { Menu, MenuItem } from "@mui/material";
import { forwardRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "../../i18n/provider";
import { getColorConf, getIconConf } from "../../utils/styles";
import { Button } from "./Button";
import { cl } from "../../utils/misc";

export const ActionsMenu = ({
  _id,
  model,
  status,
  editDocument,
  deleteDocument,
  edit,
  draft,
  pending,
  inprogress,
  fulfilling,
  refused,
  closed,
  opened,
  urgent,
  stalled,
  fulfilled,
  forceFulfilled,
  cancelled,
  arrived,
  resolved,
  remove,
  problem,
  replace,
  history = true,
  requiresItems = [],
  opensMessages = [],
  products,
  target,
  items_count,
  skipItemsOnFulfill = false,
  print = undefined,
  isView = false,
  isSmall = false,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useHistory();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function editStatus(status, confirmType = "confirm", ...args) {
    const changes = { status };
    handleClose();
    if (requiresItems.includes(status)) confirmType = "items";
    let callback = undefined;

    if (opensMessages.includes(status)) {
      callback = () => navigate.push(`${isView ? "/view/" : "/"}${model}/${_id}/chat`);
    }

    if (target && model === "orders" && status === "problem") {
      callback = () => {
        window.open(
          `https://wa.me/212${+target.phone}?text=Salam%20${
            target.name
          }%2C%0Am3akom%20livreur%20mn%20Livo.ma%2C%20momkin%20taslo%20bia%20f%20a9reb%20wa9t%203la%209bel%20la%20commande%20dialkom%2C%20Merci`,
          "_blank"
        );
      };
    }

    if (model === "transfers" && status === "fulfilled") {
      changes["force"] = true;
    }

    if (status === "fulfilled" && skipItemsOnFulfill) {
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
        className={`bg-${getColorConf(
          model,
          status
        )}  hover:to-gray-600 rounded-full h-10 text-lg text-white flex items-center shadow-sm hover:shadow-md justify-center transition duration-300 cursor-pointer`}
        onClick={handleClick}>
        <i className={`fas ${getIconConf(model, status)}`}></i>
      </div> */}
      <Button
        btnColor=""
        className={cl("bg-" + getColorConf(model, status), {
          "!min-w-[40px] w-min !h-8 px-0 py-0 border-2 border-black/20": isSmall,
        })}
        onClick={handleClick}>
        <i className={`fas ${getIconConf(model, status)} text-white`}></i>
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        autoFocus={false}
        onClose={handleClose}>
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
        {replace && (
          <ActionMenuItem
            status="replace"
            component={Link}
            to={isView ? "/view/" : "/" + model + "/" + _id + "/replace"}
            icon="fa-exchange-alt"
            color="blue-400"
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
                ["orders", "pickups", "purges"].includes(model) && !skipItemsOnFulfill
                  ? "items"
                  : undefined,
                {
                  fetchDocument: false,
                  products: model === "orders" ? products : undefined,
                  expected_items_count: model === "pickups" ? items_count : undefined,
                }
              )
            }
          />
        )}
        {forceFulfilled && (
          <ActionMenuItem
            model={model}
            status="force-fulfilled"
            onClick={() => editDocument({ status: "fulfilled", force: true })}
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
        {pending && (
          <ActionMenuItem model={model} status="pending" onClick={() => editStatus("pending")} />
        )}
        {inprogress && (
          <ActionMenuItem
            model={model}
            status="in progress"
            onClick={() =>
              editStatus(
                "in progress",
                ["transfers"].includes(model) && status === "in progress" ? "items" : undefined
              )
            }
          />
        )}
        {fulfilling && (
          <ActionMenuItem
            model={model}
            status="fulfilling"
            onClick={() =>
              editStatus(
                "fulfilling", // only pickups
                "items",
                {
                  optional: true,
                  expected_items_count: model === "pickups" ? items_count : undefined,
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
        {refused && (
          <ActionMenuItem model={model} status="refused" onClick={() => editStatus("refused")} />
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
        {arrived && (
          <ActionMenuItem model={model} status="arrived" onClick={() => editStatus("arrived")} />
        )}
        {resolved && (
          <ActionMenuItem model={model} status="resolved" onClick={() => editStatus("resolved")} />
        )}

        {closed && (
          <ActionMenuItem model={model} status="closed" onClick={() => editStatus("closed")} />
        )}

        {opened && (
          <ActionMenuItem model={model} status="opened" onClick={() => editStatus("opened")} />
        )}
        {urgent && (
          <ActionMenuItem model={model} status="urgent" onClick={() => editStatus("urgent")} />
        )}
        {stalled && (
          <ActionMenuItem model={model} status="stalled" onClick={() => editStatus("stalled")} />
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
            color="blue-400"
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
