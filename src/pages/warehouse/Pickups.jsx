import { SButton } from "../../components/shared/Button";
import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { PickupCard } from "../../components/warehouse/PickupCard";
import { withCatch } from "../../components/shared/SafePage";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { sortByAwaitingReply } from "../../utils/misc";
import { useTranslation } from "../../i18n/provider";

function PickupsPage(props) {
  const tl = useTranslation();
  return (
    <DocumentsManager
      model="pickups"
      initialFilters={{
        status: "pending",
        keyword: "",
        deliverer: "all",
        tags: "all",
        from_date: null,
        to_date: null,
        action: "all",
        thumbs: "all",
        pickupRating: "all",
        supportRating: "all"
      }}
      DocumentCard={PickupCard}
      processDocuments={sortByAwaitingReply}
      sortOptions={[
        "-timestamps.updated",
        "timestamps.updated",
        "timestamps.last_client_message",
        "deliverer",
      ]}
      initialSort="-timestamps.updated"
      LoadingCard={(props) => <CardSkeleton partsCount={6} type={2} {...props} />}>
      <SButton href="/pickups/add" label={tl("add_pickup")} />
    </DocumentsManager>
  );
}

export default withCatch(PickupsPage);
