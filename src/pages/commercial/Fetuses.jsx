import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { withCatch } from "../../components/shared/SafePage";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { FetusCard } from "../../components/commercial/FetusCard";

function FetusesPage(props) {
  return (
    <DocumentsManager
      model="fetuses"
      customRoute={"/auth/fetuses"}
      initialFilters={{}}
      DocumentCard={FetusCard}
      LoadingCard={(props) => <CardSkeleton partsCount={6} type={2} {...props} />}>
      {/*  */}
    </DocumentsManager>
  );
}

export default withCatch(FetusesPage);
