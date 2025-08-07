import { useState } from "react";
import { useToast } from "../../hooks/useToast";
import { JOBS_URL, xFetch } from "../../utils/constants";
import { Button } from "../shared/Button";
import { useConfirmation } from "../shared/ToolsProvider";

export const TransferBackButton = ({}) => {
  const confirmAction = useConfirmation();
  const showToast = useToast();
  const [btnState, setBtnState] = useState(null);

  function promptTransferBack() {
    confirmAction({
      title: "Create Transfer Back to Main Warehouse",
      icon: `arrow-right`,
      onConfirm: createTransferBack,
    });
  }

  async function createTransferBack() {
    if (btnState === "loading") return;
    setBtnState("loading");
    const { error } = await xFetch("/runs/transfer_back", { method: "POST" }, undefined, JOBS_URL);
    setBtnState(null); // to complete or something
    if (error) showToast(error, "error");
    else showToast("success", "success");
  }

  return (
    <Button
      label="Transfer Back"
      icon="arrow-right"
      btnColor="secondary"
      onClick={promptTransferBack}
      isLoading={btnState === "loading"}
      disabled={!!btnState}
    />
  );
};
