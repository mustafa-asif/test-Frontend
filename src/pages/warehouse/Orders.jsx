import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { OrderCard } from "../../components/warehouse/OrderCard";
import { withCatch } from "../../components/shared/SafePage";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { sortByAwaitingReply } from "../../utils/misc";
import { useStoreState } from "easy-peasy";
import { PrintOrdersButton } from "../../components/shared/PrintOrders";
import { SyncIntegrationsBtn } from "../../components/shared/SyncIntegrationsBtn";

function OrdersPage(props) {
  const isMainWarehouse = useStoreState((state) => state.auth.user.warehouse.main);
  const hasIntegration = useStoreState((state) => state.auth.user.warehouse?.integration);
  return (
    <DocumentsManager
      model="orders"
      initialFilters={{
        status: "pending",
        keyword: "",
        deliverer: "all",
        tags: "all",
        from_date: null,
        to_date: null,
        action: "all",
        thumbs: "all",
        orderRating: "all",
        supportRating: "all",
        needToReturn: "all",
      }}
      DocumentCard={OrderCard}
      processDocuments={sortByAwaitingReply}
      sortOptions={[
        "-timestamps.updated",
        "timestamps.updated",
        "timestamps.last_client_message",
        "deliverer",
      ]}
      initialSort="-timestamps.updated"
      LoadingCard={(props) => <CardSkeleton partsCount={6} type={2} {...props} />}
      downloadXls>
      {isMainWarehouse && <PrintOrdersButton />}
      {hasIntegration && <SyncIntegrationsBtn />}
    </DocumentsManager>
  );
}

export default withCatch(OrdersPage);
