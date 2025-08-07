import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { withCatch } from "../../components/shared/SafePage";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { PaymentsCard } from "../../components/payman/PaymentCard";
import { SButton } from "../../components/shared/Button";
import { Profit } from "../../components/admin/Profit";

function PaymentsPage(props) {
  return (
    <DocumentsManager
      model="invoices"
      // initialFilters={{ keyword: "", status: "all", date: "all time" }} // doesnt work
      DocumentCard={PaymentsCard}
      LoadingCard={(props) => <CardSkeleton partsCount={6} type={2} {...props} />}
      refreshOnVisit>
      <SButton href="/payments/add" label="Ajouter un paiement" />
      <Profit medium="bank" />
      <Profit medium="cash" />
    </DocumentsManager>
  );
}

export default withCatch(PaymentsPage);
