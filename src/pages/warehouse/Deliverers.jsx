import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { DelivererCard } from "../../components/warehouse/DelivererCard";
import { withCatch } from "../../components/shared/SafePage";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { SButton } from "../../components/shared/Button";
import { useTranslation } from "../../i18n/provider";

function DeliverersPage(props) {
  const tl = useTranslation();
  return (
    <DocumentsManager
      model="deliverers"
      initialFilters={{ status: "active", keyword: "" }}
      DocumentCard={DelivererCard}
      LoadingCard={(props) => <CardSkeleton partsCount={6} type={2} {...props} />}>
      <SButton href="/deliverers/add" label={tl("add_deliverer")} />
    </DocumentsManager>
  );
}

export default withCatch(DeliverersPage);
