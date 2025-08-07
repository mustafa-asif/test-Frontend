import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { withCatch } from "../../components/shared/SafePage";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { ClientCycleCard } from "../../components/payman/ClientCycleCard";

function ClientCyclesPage(props) {
  return (
    <DocumentsManager
      model="clientCycles"
      initialFilters={{ keyword: "", status: "active-ready", from_date: null, to_date: null }} // user
      DocumentCard={ClientCycleCard}
      LoadingCard={(props) => (
        <CardSkeleton partsCount={6} type={2} {...props} />
      )}></DocumentsManager>
  );
}

export default withCatch(ClientCyclesPage);
