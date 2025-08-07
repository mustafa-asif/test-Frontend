import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { OrderCard } from "../../components/followup/OrderCard";
import { withCatch } from "../../components/shared/SafePage";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { sortByAwaitingReply } from "../../utils/misc";
import { useStoreState } from "easy-peasy";
import { SyncIntegrationsBtn } from "../../components/shared/SyncIntegrationsBtn";

function OrdersPage(props) {
  const isMainFollowup = useStoreState((state) => state.auth.user?.isMainUser);
  return (
    <DocumentsManager
      model="orders"
      initialFilters={{
        status: "problem",
        keyword: "",
        warehouse: "all",
        tags: "all",
        from_date: null,
        to_date: null,
        action: "all",
        thumbs: "all",
        orderRating: "all",
        supportRating: "all",
        supportCategory: "all",
        supportSubCategory: "all",
        orderIssue: "all",
      }}
      processDocuments={sortByAwaitingReply}
      sortOptions={["-timestamps.updated", "timestamps.updated", "timestamps.last_client_message"]}
      initialSort="-timestamps.updated"
      DocumentCard={OrderCard}
      LoadingCard={(props) => <CardSkeleton partsCount={6} type={2} {...props} />}
      downloadXls>
      {isMainFollowup && <SyncIntegrationsBtn />}
    </DocumentsManager>
  );
}

export default withCatch(OrdersPage);
