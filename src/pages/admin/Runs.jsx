import { RunCard } from "../../components/admin/RunCard";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { withCatch } from "../../components/shared/SafePage";
import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { JOBS_URL } from "../../utils/constants";

function RunsPage() {
  return (
    <DocumentsManager
      model="runs"
      DocumentCard={RunCard}
      initialFilters={{ keyword: "", date: "today" }}
      customApi={JOBS_URL}
      LoadingCard={(props) => (
        <CardSkeleton partsCount={4} type={2} {...props} />
      )}></DocumentsManager>
  );
}

export default withCatch(RunsPage);
