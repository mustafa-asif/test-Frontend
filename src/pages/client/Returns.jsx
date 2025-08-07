import { SButton } from "../../components/shared/Button";
import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { ReturnCard } from "../../components/client/ReturnCard";
import { withCatch } from "../../components/shared/SafePage";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { useTranslation } from "../../i18n/provider";

function ReturnsPage(props) {
  const tl = useTranslation();
  return (
    <DocumentsManager
      model="purges"
      initialFilters={{ keyword: "", from_date: null, to_date: null, status: "all" }}
      DocumentCard={ReturnCard}
      sortOptions={["-timestamps.created", "timestamps.created"]}
      initialSort="-timestamps.created"
      LoadingCard={(props) => <CardSkeleton partsCount={4} type={2} {...props} />}>
      <SButton href="/returns/add" label={tl("add_return")} />
    </DocumentsManager>
  );
}

export default withCatch(ReturnsPage);
