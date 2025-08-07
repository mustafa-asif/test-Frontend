import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { InvoiceCard } from "../../components/warehouse/InvoiceCard";
import { withCatch } from "../../components/shared/SafePage";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { SButton } from "../../components/shared/Button";
import { useTranslation } from "../../i18n/provider";

function InvoicesPage(props) {
  const tl = useTranslation();
  return (
    <DocumentsManager
      model="invoices"
      initialFilters={{ keyword: "", date: "all time", status: "all" }}
      DocumentCard={InvoiceCard}
      LoadingCard={(props) => <CardSkeleton partsCount={4} type={2} {...props} />}
      refreshOnVisit>
      <SButton href="/invoices/add" label={tl("add_invoice")} />
    </DocumentsManager>
  );
}

export default withCatch(InvoicesPage);
