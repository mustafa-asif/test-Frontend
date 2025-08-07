import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { ShipperCard } from "../../components/admin/ShipperCard";
import { withCatch } from "../../components/shared/SafePage";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { SButton } from "../../components/shared/Button";
import { useTranslation } from "../../i18n/provider";

function ShippersPage(props) {
  const tl = useTranslation();
  return (
    <DocumentsManager
      model="shippers"
      initialFilters={{ keyword: "" }}
      DocumentCard={ShipperCard}
      LoadingCard={(props) => <CardSkeleton partsCount={6} type={2} {...props} />}>
      <SButton href="/shippers/add" label={tl("add_shipper")} />
    </DocumentsManager>
  );
}

export default withCatch(ShippersPage);
