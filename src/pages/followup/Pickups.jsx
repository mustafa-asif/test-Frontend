import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { PickupCard } from "../../components/followup/PickupCard";
import { withCatch } from "../../components/shared/SafePage";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { sortByAwaitingReply } from "../../utils/misc";

function PickupsPage(props) {
  return (
    <DocumentsManager
      model="pickups"
      initialFilters={{
        status: "problem",
        keyword: "",
        warehouse: "all",
        tags: "all",
        from_date: null,
        to_date: null,
        action: "all",
        thumbs: "all",
        pickupRating: "all",
        supportRating: "all",
        supportCategory: "all",
        supportSubCategory:"all",
      }}
      DocumentCard={PickupCard}
      processDocuments={sortByAwaitingReply}
      sortOptions={["-timestamps.updated", "timestamps.updated", "timestamps.last_client_message"]}
      initialSort="-timestamps.updated"
      LoadingCard={(props) => (
        <CardSkeleton partsCount={6} type={2} {...props} />
      )}></DocumentsManager>
  );
}

export default withCatch(PickupsPage);
