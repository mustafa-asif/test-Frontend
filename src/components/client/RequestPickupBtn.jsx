import { useEffect, useState } from "react";
import { xFetch } from "../../utils/constants";
import { SButton } from "../shared/Button";
import { cl } from "../../utils/misc";

export const RequestPickupBtn = () => {
  const [isLoading, setLoading] = useState(false);
  const [needsPickup, setNeedsPickup] = useState(false);

  async function checkNeedsPickup() {
    if (isLoading) return;
    setLoading(true);
    const { data, error } = await xFetch("/alternatives/needs-pickup");
    setLoading(false);
    if (error) return console.log(error);
    setNeedsPickup(!!data);
  }

  useEffect(() => {
    checkNeedsPickup();
  }, []);

  return (
    <SButton
      href="/pickups/add"
      label={"Demander Rammassage"}
      className={cl({ "opacity-70": !needsPickup })}
      icon="dolly"
      iconColor="red-400"
      badgePing={needsPickup}
    />
  );
};
