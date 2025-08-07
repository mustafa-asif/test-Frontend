import { CycleCard } from "../../components/client/CycleCard";
import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { withCatch } from "../../components/shared/SafePage";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { Profit } from "../../components/client/Profit";

function CyclesPage(props) {
  return (
    <DocumentsManager
      model="cycles"
      increments={32}
      initialFilters={{ keyword: "", status: "all" }}
      DocumentCard={CycleCard}
      LoadingCard={(props) => <CardSkeleton partsCount={6} type={2} {...props} />}>
      <Profit />
    </DocumentsManager>
  );
}

export default withCatch(CyclesPage);
