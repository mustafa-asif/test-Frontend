import { useStoreState, useStoreActions } from "easy-peasy";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../shared/Card";
import { NumPod } from "../shared/NumPod";
import { Copyable } from "../shared/Copyable";
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Switch from "@mui/material/Switch";
import { imgSrc, xFetch } from "../../utils/constants";
import { IconButton } from "../shared/Button";
import { useToast } from "../../hooks/useToast";
import { useConfirmation } from "../shared/ToolsProvider";
import { useTranslation } from "../../i18n/provider";
import { Pic } from "../shared/Pic";

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} componentsProps={{ tooltip: { className: className } }} />
))(`
    color: #ffffff;
    background-color: rgba(31, 41, 55, 0.87);
    font-size: 1rem;
    font-weight: bold;
    font-family: nunito, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial;
`);

export const ProductCard = ({ _id, name, image, refr, items = [], transfer_back }) => {
  const [isLoading, setLoading] = useState(false);

  const confirmAction = useConfirmation();
  const removeProduct = useStoreActions((actions) => actions.products.removeProduct);
  const pack = useStoreState((state) => state.auth.user?.client?.pack);
  // const lock_items = useStoreState((state) => state.auth.user?.client?.lock_items);
  const showToast = useToast();
  const tl = useTranslation();

  const itemsPerCity = getItemsPerCity(items);
  // if (lock_items && itemsPerCity.length < 1) return null;

  async function handleDelete() {
    if (isLoading) return;
    setLoading(true);
    const { error } = await xFetch(`/products/${_id}`, { method: "DELETE" });
    setLoading(false);
    if (error) return showToast(error, "error");
    showToast("success", "success");
    removeProduct(_id);
  }

  async function handleCheckChange(e, value) {
    if (isLoading) return;
    setLoading(true);
    const { error } = await xFetch(`/products/${_id}`, {
      method: "PATCH",
      body: { transfer_back: value },
    });
    setLoading(false);
    if (error) return showToast(error, "error");
    showToast("success", "success");
  }

  return (
    <Card loading={isLoading}>
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-full h-10 text-sm font-semibold flex items-center col-span-4 border border-solid border-gray-100">
          <Pic className="mr-3" radius={5} jdenticonValue={_id} />
          <span className="w-full">
            <Copyable text={name} />
            {refr && <span className="ml-[5px] opacity-60">({refr})</span>}
          </span>
          {pack?.startsWith("stockage") && (
            <StyledTooltip title="Retour automatique des articles" placement="top">
              <span>
                <GreenSwitch
                  className="mr-2"
                  checked={transfer_back}
                  disabled={isLoading}
                  onChange={handleCheckChange}
                />
              </span>
            </StyledTooltip>
          )}
          {itemsPerCity.length < 1 && (
            <span className={`${isLoading ? "animate-spin" : ""} h-10 w-10`}>
              <IconButton
                size="md"
                icon={isLoading ? "spinner" : "trash"}
                onClick={() =>
                  confirmAction({ onConfirm: handleDelete, title: `${tl("del_product")} ${name}?` })
                }
                disabled={isLoading}
                iconColor="red"
              />
            </span>
          )}
        </div>
        {itemsPerCity.map((city, i) => (
          <Link
            to={`/products/${_id}/reserved?city=${city.name}`}
            key={i}
            className="rounded-full h-10 text-sm font-semibold flex items-center col-span-2 bg-gray-50 border border-solid border-gray-100 justify-center capitalize">
            {city.name}

            {city.free > 0 && <NumPod number={city.free} className="ml-1" color="green" />}
            {city.busy > 0 && <NumPod number={city.busy} className="ml-1" color="yellow" />}
            {city.alien > 0 && <NumPod number={city.alien} className="ml-1" color="gray" />}
          </Link>
        ))}
      </div>
    </Card>
  );
};

function getItemsPerCity(items) {
  const cities = {};

  for (const item of items) {
    let city = item.warehouse?.city || "Not Picked Up";
    cities[city] ??= { name: city, free: 0, busy: 0, alien: 0 };
    const isFree =
      item.status === "available" &&
      !item.reserved_order &&
      !item.reserved_transfer &&
      !item.replacement_order;
    let group = isFree ? "free" : item.status !== "awaiting pickup" ? "busy" : "alien";
    cities[city][group] ??= 0;
    cities[city][group] += 1;
  }

  delete cities["Not Picked Up"]; // no need in production
  return Object.values(cities);
}

const GreenSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  "width": 42,
  "height": 26,
  "padding": 0,
  "& .MuiSwitch-switchBase": {
    "padding": 0,
    "margin": 2,
    "transitionDuration": "300ms",
    "&.Mui-checked": {
      "transform": "translateX(16px)",
      "color": "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#34D399",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#34D399",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: "#F1F5F9",
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.7,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#E2E8F0",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));
