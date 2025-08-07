import { CycleCard } from "../../components/shared/CycleCard";
import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { withCatch } from "../../components/shared/SafePage";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { Profit } from "../../components/warehouse/Profit";

function DelivererCyclesPage(props) {
  return (
    <DocumentsManager
      model="delivererToWarehouseCycles"
      increments={32}
      initialFilters={{
        keyword: "",
        deliverer: "",
        deliverer_status: 'all',
        show_deliverer_payments: true,
      }}
      DocumentCard={CycleCard}
      sortOptions={["-timestamps.updated", "timestamps.updated"]}
      initialSort="-timestamps.updated"
      LoadingCard={(props) => <CardSkeleton partsCount={6} type={2} {...props} />}>
    </DocumentsManager>
  );
}

export default withCatch(DelivererCyclesPage);
