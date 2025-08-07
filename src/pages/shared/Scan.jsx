import { ScanComponent } from "../../components/shared/ScanComponent";
import { useGoBack } from "../../components/shared/LastLocation";
import { useState } from "react";
import { Fragment } from "react";
import { useStoreState } from "easy-peasy";
import { getIDModelName } from "../../utils/misc";
import { useHistory, useLocation } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { xFetch } from "../../utils/constants";
import { usePlaySound } from "../../sounds/Sounds";
import { useRouteQuery } from "../../hooks/useRouteQuery";

export default function ScanPage({ open, ...props }) {
  const role = useStoreState((state) => state.auth.user.role);
  const history = useHistory();
  const location = useLocation();
  const playSound = usePlaySound();
  const showToast = useToast();

  const [isTaking, setTaking] = useState(false);

  const handleClose = useGoBack("/products");
  const model = location.state?.model;
  const shouldKeepOpen = role === "warehouse" && model === "pickups";

  const deliverer_id = useRouteQuery("deliverer_id") || undefined;

  async function handleData(id) {
    const model = getIDModelName(id);

    if (model === "orders") {
      setTaking(true);
      // history.replace(`/view/${model}/${id}`);
      const { data, error } = await xFetch(
        `/items?locked_order._id=${id}&skipFilters=true&_show=_id`
      );

      if (error) {
        if (!shouldKeepOpen) handleClose();
        setTaking(false);
        return showToast(error, "warning"); //?
      }

      if (data.length === 0) {
        if (!shouldKeepOpen) handleClose();
        setTaking(false);
        return showToast("aucun article trouvé pour commande", "warning");
      }

      showToast(`${data.length} articles trouvés`);

      for (const { _id } of data) {
        const status = role === "warehouse" && !deliverer_id ? "available" : "with deliverer";
        const { error } = await xFetch(`/items/${_id}`, {
          method: "PATCH",
          body: { status, deliverer_id },
        });

        if (error) {
          playSound("scan-error");
          showToast(error, "warning"); //?
          continue;
        }
        playSound("scan-success");
        showToast(
          !deliverer_id ? "article ajouté au stock" : "articlé donné au livreur",
          "success"
        );
      }

      setTaking(false);
      if (!shouldKeepOpen) handleClose();
      return;
    }

    if (model === "items" && ["warehouse", "deliverer"].includes(role)) {
      setTaking(true);
      const status = role === "warehouse" && !deliverer_id ? "available" : "with deliverer";
      const { error } = await xFetch(`/items/${id}`, {
        method: "PATCH",
        body: { status, deliverer_id },
      });

      setTaking(false);
      if (error) {
        playSound("scan-error");
        showToast(error, "warning"); //?
        if (!shouldKeepOpen) handleClose();
        return;
      }
      playSound("scan-success");
      showToast(!deliverer_id ? "article ajouté au stock" : "articlé donné au livreur", "success");
      if (!shouldKeepOpen) handleClose();
      return;
    }

    showToast(`recherche invalide`, "success");
    if (!shouldKeepOpen) handleClose();
    return;
  }

  function setOpen(value) {
    if (value === false) handleClose();
  }
  return (
    <>
      <ScanComponent
        isOpen={open}
        setOpen={setOpen}
        customLoading={isTaking ? "Taking Item" : undefined}
        autoClose={false}
        state={{
          onData: handleData,
          fetchDocument: false,
          allowedModels: [
            "orders",
            "items",
            // "transfers",
            // "products",
            // "cycles",
            // "pickups",
            // "containers",
          ],
        }}
      />
    </>
  );
}
