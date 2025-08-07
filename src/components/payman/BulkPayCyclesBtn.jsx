import { Fragment, useState } from "react";
import { Button, IconButton } from "../shared/Button";
import { useConfirmation, useSelecting } from "../shared/ToolsProvider";
import { useToast } from "../../hooks/useToast";
import { xFetch } from "../../utils/constants";

export const BulkPayCyclesBtn = ({ model }) => {
  const [isLoading, setLoading] = useState(false);
  const { selected, selectingModel, setSelectingModel } = useSelecting();
  const showToast = useToast();
  const confirmAction = useConfirmation();
  const currentySelecting = model === selectingModel;

  function handleClick() {
    if (isLoading) return;
    if (!currentySelecting) {
      setSelectingModel(model);
      return;
    }
    if (currentySelecting && selected.length > 0) {
      confirmAction({
        title: "Êtes-vous sûr?",
        onConfirm: bulkMarkCycles,
      });
    }
  }

  function abortBulk() {
    setSelectingModel(null);
  }

  async function bulkMarkCycles() {
    if (isLoading) return;
    setLoading(true);
    const { data, error } = await xFetch(`/cycles/mass`, {
      method: "PATCH",
      body: { cycle_ids: selected, status: "paid" },
    });
    setLoading(false);
    if (error) return showToast(error, "error");

    if (data) {
      setSelectingModel(null);
      showToast(`Success ${data.succeeded}; Failed ${data.failed}`, "success");
    }
  }

  return (
    <div className="flex gap-x-[5px]">
      <Button
        onClick={handleClick}
        isLoading={isLoading}
        className="h-full px-[20px]"
        icon="minus-square">
        <div className="ml-[10px]">
          {currentySelecting && (
            <Fragment>
              <span className="">Marquer {selected.length} Payé</span>
            </Fragment>
          )}
          {!currentySelecting && <Fragment>Commencer Selection</Fragment>}
        </div>
      </Button>
      {currentySelecting && <IconButton onClick={abortBulk} iconColor="black" icon="minus" />}
    </div>
  );
};
