import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { withCatch } from "../../components/shared/SafePage";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { SButton } from "../../components/shared/Button";
import { FeesCard } from "../../components/admin/FeesCard";

function FeesPage(props) {
  return (
    <DocumentsManager
      model="fees"
      initialFilters={{}} // user
      DocumentCard={FeesCard}
      LoadingCard={(props) => <CardSkeleton partsCount={6} type={2} {...props} />}>
      <SButton href="/fees/add" label="Add Fees" />
    </DocumentsManager>
  );
}

export default withCatch(FeesPage);
