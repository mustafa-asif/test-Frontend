import { useState } from "react";
import { useToast } from "../../hooks/useToast";
import { xFetch } from "../../utils/constants";
import { Button } from "../shared/Button";
import { useConfirmation } from "../shared/ToolsProvider";

export const ResetButton = () => {
  const [isLoading, setLoading] = useState(false);
  const confirmAction = useConfirmation();
  const showToast = useToast();

  async function handleReset() {
    if (isLoading) return;
    setLoading(true);
    const { error } = await xFetch(`/snapshots/reset`, { method: "POST" });
    setLoading(false);
    if (error) return showToast(error, "error");
    showToast("success", "success");
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
  return (
    <Button
      label="Reset Database"
      onClick={() => confirmAction({ onConfirm: handleReset, title: "Are you sure?" })}
      isLoading={isLoading}
      disabled={isLoading}
    />
  );
};
