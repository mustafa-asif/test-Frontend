import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { TransferCard } from "../../components/followup/TransferCard";
import { withCatch } from "../../components/shared/SafePage";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { sortByAwaitingReply } from "../../utils/misc";

function TransfersPage(props) {
  return (
    <DocumentsManager
      model="transfers"
      initialFilters={{
        status: "pending",
        supportCategory: "all",
        supportRating: "all",
        keyword: "",
        warehouse: "all",
        tags: "all",
        from_date: null,
        to_date: null,
      }}
      DocumentCard={TransferCard}
      processDocuments={sortByAwaitingReply}
      sortOptions={["-timestamps.updated", "timestamps.updated", "timestamps.last_client_message"]}
      initialSort="-timestamps.updated"
      LoadingCard={(props) => (
        <CardSkeleton partsCount={6} type={2} {...props} />
      )}></DocumentsManager>
  );
}

export default withCatch(TransfersPage);
