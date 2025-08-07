import { Dialog } from "@mui/material";
import { useTranslation } from "../../i18n/provider";
import { Label } from "./Label";
import { WarehousesCombobox } from "../shared/WarehousesCombobox";
import { IconButton } from "./Button";
import { useStoreState } from "easy-peasy";
import { useState } from "react";

export const SelectWarehouseComponent = ({ isOpen, state, onClose }) => {
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const userRole = useStoreState((state) => state.auth.user?.role);
  const tl = useTranslation();

  if (!["admin", "followup"].includes(userRole)) <></>;

  function handleClose() {
    onClose();
  }

  function handleSubmit() {
    if (!selectedWarehouse) return;
    state.callback?.(selectedWarehouse);
    setSelectedWarehouse(null);
    onClose();
  }

  return (
    <Dialog onClose={handleClose} open={isOpen}>
      <div className="flex flex-col rounded-md bg-white text-xl p-6">
        <Label>Select Warehouse:</Label>
        <div className="flex gap-x-[10px]">
          <WarehousesCombobox value={selectedWarehouse} onValueChange={setSelectedWarehouse} />
          <IconButton
            disabled={!selectedWarehouse}
            icon={"arrow-right"}
            iconColor="blue"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </Dialog>
  );
};
