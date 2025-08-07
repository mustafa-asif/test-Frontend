import { SButton } from "../../components/shared/Button";
import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { withCatch } from "../../components/shared/SafePage";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { WarehouseCard } from "../../components/admin/WarehouseCard";

function WarehousesPage(props) {
  return (
    <DocumentsManager
      model="warehouses"
      //   initialFilters={{ status: "all", keyword: "" }}
      increments={32}
      initialFilters={{ keyword: "", status: "active" }}
      DocumentCard={WarehouseCard}
      LoadingCard={(props) => <CardSkeleton partsCount={6} type={2} {...props} />}>
      <SButton href="/warehouses/add" label="Add Warehouse" />
    </DocumentsManager>
  );
}

export default withCatch(WarehousesPage);
