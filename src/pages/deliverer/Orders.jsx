import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { OrderCard } from "../../components/deliverer/OrderCard";
import { withCatch } from "../../components/shared/SafePage";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { sortByAwaitingReply } from "../../utils/misc";
import { StartOrdersButton } from "../../components/deliverer/StartOrdersButton";

function OrdersPage(props) {
  return (
    <DocumentsManager
      model="orders"
      initialFilters={{
        status: "in progress",
        keyword: "",
        tags: "all",
        from_date: null,
        to_date: null,
      }}
      DocumentCard={OrderCard}
      processDocuments={sortByAwaitingReply}
      sortOptions={["-timestamps.updated", "timestamps.updated", "timestamps.last_client_message"]}
      initialSort="-timestamps.updated"
      LoadingCard={(props) => <CardSkeleton partsCount={6} type={2} {...props} />}>
      <StartOrdersButton />
    </DocumentsManager>
  );
}

export default withCatch(OrdersPage);
