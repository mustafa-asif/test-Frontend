import { useState } from "react";
import { Button } from "./Button";
import { useToast } from "../../hooks/useToast";
import { xFetch } from "../../utils/constants";
import { useStoreState } from "easy-peasy";
import { useSelectWarehouse } from "./ToolsProvider";

export function SyncIntegrationsBtn() {
  const [isLoading, setLoading] = useState(false);
  const userRole = useStoreState((state) => state.auth.user.role);
  const showToast = useToast();
  const selectWarehouse = useSelectWarehouse();

  async function triggerSync(warehouse_id) {
    if (isLoading) return;
    setLoading(true);
    const { error } = await xFetch(`/orders/integration_sync`, {
      method: "POST",
      body: { warehouse_id },
    });
    setLoading(false);
    if (error) {
      return showToast(error, "error");
    } else {
      return showToast("Sync initialized", "default");
    }
  }

  function handlePress() {
    if (isLoading) return;
    if (userRole !== "warehouse") {
      selectWarehouse({ callback: (warehouse_id) => triggerSync(warehouse_id) });
      return;
    }
    triggerSync();
  }

  return (
    <Button
      icon="sync"
      onClick={handlePress}
      isLoading={isLoading}
      btnColor="blue"
      className="!w-max px-[15px]">
      <span className="mx-[5px]">Sync Integrations</span>
    </Button>
  );
}
