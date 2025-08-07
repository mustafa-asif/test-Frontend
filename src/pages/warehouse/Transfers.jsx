import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { TransferCard } from "../../components/warehouse/TransferCard";
import { withCatch } from "../../components/shared/SafePage";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { sortByAwaitingReply } from "../../utils/misc";
import { TransferBackButton } from "../../components/warehouse/TransferBackButton";
import { useStoreState } from "easy-peasy";

function TransfersPage(props) {
  const lock_items = useStoreState((state) => state.auth.user.warehouse?.options?.lock_items);
  return (
    <DocumentsManager
      model="transfers"
      initialFilters={{
        status: "pending",
        keyword: "",
        tags: "all",
        from_date: null,
        to_date: null,
        transferType: "stock"
      }}
      DocumentCard={TransferCard}
      processDocuments={sortByAwaitingReply}
      sortOptions={["-timestamps.updated", "timestamps.updated", "timestamps.last_client_message"]}
      initialSort="-timestamps.updated"
      LoadingCard={(props) => <CardSkeleton partsCount={6} type={2} {...props} />}>
      {!lock_items && <TransferBackButton />}
    </DocumentsManager>
  );
}

export default withCatch(TransfersPage);
