import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { ClientCard } from "../../components/followup/ClientCard";
import { withCatch } from "../../components/shared/SafePage";
import { DocumentsManager } from "../../components/shared/DocumentsManager";

function ClientsPage(props) {
  return (
    <DocumentsManager
      model="clients"
      increments={32}
      initialFilters={{ keyword: "", status: "unassigned", from_date: null, to_date: null }}
      sortOptions={["-timestamps.created", "timestamps.created"]}
      initialSort="-timestamps.created"
      DocumentCard={ClientCard}
      LoadingCard={(props) => (
        <CardSkeleton partsCount={6} type={2} {...props} />
      )}></DocumentsManager>
  );
}

export default withCatch(ClientsPage);
