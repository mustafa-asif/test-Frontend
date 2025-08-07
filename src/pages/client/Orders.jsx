import { useState, useEffect } from "react";
import { YoutubeDialog } from "../../components/shared/YoutubeDialog";
import { SButton } from "../../components/shared/Button";
import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { OrderCard } from "../../components/client/OrderCard";
import { withCatch } from "../../components/shared/SafePage";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { sortByAwaitingReply } from "../../utils/misc";
import { useTranslation } from "../../i18n/provider";
import { PrintOrdersButton } from "../../components/shared/PrintOrders";
import { useStoreState } from "easy-peasy";
// import { OrdersTable } from "../../components/client/OrdersTable";
import { HorizontalOrderCard } from "../../components/client/HorizontalOrderCard";
import { RequestPickupBtn } from "../../components/client/RequestPickupBtn";

function OrdersPage(props) {
  const tl = useTranslation();
  const clientLockItems = useStoreState((state) => state.auth.user.client.lock_items);

  const [openYoutube, setOpenYoutube] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("YT_ORDERS") < 2) {
      setOpenYoutube(true);
      localStorage.setItem("YT_ORDERS", (parseInt(localStorage.getItem("YT_ORDERS")) || 0) + 1);
    }
  }, []);

  return (
    <DocumentsManager
      model="orders"
      initialFilters={{
        status: "all",
        keyword: "",
        from_date: null,
        to_date: null,
      }}
      DocumentCard={OrderCard}
      HorizontalCard={HorizontalOrderCard}
      // DocumentsTable={OrdersTable}
      processDocuments={sortByAwaitingReply}
      sortOptions={["-timestamps.updated", "timestamps.updated", "timestamps.last_staff_message"]}
      initialSort="-timestamps.updated"
      LoadingCard={(props) => <CardSkeleton partsCount={6} type={2} {...props} />}
      downloadXls>
      <SButton href="/orders/add" label={tl("add_order")} />
      {clientLockItems && <PrintOrdersButton />}
      <RequestPickupBtn />
    </DocumentsManager>
  );
}

export default withCatch(OrdersPage);
