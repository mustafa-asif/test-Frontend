import { useState } from "react";
import { useTranslation } from "../../i18n/provider";
import { Button } from "../shared/Button";
import { useToast } from "../../hooks/useToast";
import { xFetch } from "../../utils/constants";
import { useConfirmation } from "../shared/ToolsProvider";

export const ReturnItemsButton = ({ _id, alreadyCreated, isForReplacing }) => {
  const [isLoading, setLoading] = useState(false);
  const tl = useTranslation();
  const showToast = useToast();
  const confirmAction = useConfirmation();
  async function createReturnTransfer() {
    if (isLoading) return;
    setLoading(true);
    const { data, error } = await xFetch(`/orders/${_id}/transfer_back`, { method: "POST" });
    setLoading(false);
    if (error) return showToast(error, "error");
    else showToast("transfer crée", "success");
  }
  return (
    <Button
      className="col-span-4"
      label={!isForReplacing ? "Retourner Articles" : "Retourner Replacés"}
      btnColor={"red"}
      icon={"boxes"}
      onClick={() =>
        confirmAction({ onConfirm: createReturnTransfer, title: "Créer transfer retour" })
      }
      isLoading={isLoading}
      disabled={alreadyCreated}
    />
  );
};
