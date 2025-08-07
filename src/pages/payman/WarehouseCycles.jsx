import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { withCatch } from "../../components/shared/SafePage";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { WarehouseCycleCard } from "../../components/payman/WarehouseCycleCard";

function WarehouseCyclesPage(props) {
  return (
    <DocumentsManager
      model="warehouseCycles"
      initialFilters={{ keyword: "", status: "sent", from_date: null, to_date: null }} // user
      // customFilters={{ "from.account": "warehouse" }}
      DocumentCard={WarehouseCycleCard}
      LoadingCard={(props) => (
        <CardSkeleton partsCount={6} type={2} {...props} />
      )}></DocumentsManager>
  );
}

export default withCatch(WarehouseCyclesPage);
