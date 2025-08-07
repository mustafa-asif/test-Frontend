import { useStoreState } from "easy-peasy";
import { useState } from "react";
import { useToast } from "../../hooks/useToast";
import { useTranslation } from "../../i18n/provider";
import { xFetch } from "../../utils/constants";
import { Button } from "../shared/Button";

export const StartOrdersButton = () => {
  const [isLoading, setLoading] = useState(false);
  const tl = useTranslation();
  const showToast = useToast();

  async function handleStart() {
    if (isLoading) return;
    setLoading(true);
    const { data, error } = await xFetch(`/alternatives/bulk-start-orders`, { method: "POST" });
    setLoading(false);
    if (error) return showToast(error, "error");
    showToast(tl("n_orders_started", { count: data.length }), "success");
    console.log(data);
    // navigate to in progress
  }
  return (
    <Button
      onClick={handleStart}
      isLoading={isLoading}
      className="capitalize"
      style={{ minWidth: 300 }}>
      {tl("bulk start orders")}
    </Button>
  );
};
