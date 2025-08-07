import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { withCatch } from "../../components/shared/SafePage";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { TenantCycleCard } from "../../components/payman/TenantCycleCard";

function TenantCyclesPage(props) {
  return (
    <DocumentsManager
      model="tenantCycles"
      initialFilters={{ keyword: "", status: "active", from_date: null, to_date: null }} // user
      DocumentCard={TenantCycleCard}
      LoadingCard={(props) => (
        <CardSkeleton partsCount={6} type={2} {...props} />
      )}></DocumentsManager>
  );
}

export default withCatch(TenantCyclesPage);
