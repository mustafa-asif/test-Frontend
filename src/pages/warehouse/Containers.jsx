import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { ContainerCard } from "../../components/warehouse/ContainerCard";
import { withCatch } from "../../components/shared/SafePage";
import { DocumentsManager } from "../../components/shared/DocumentsManager";

function ContainersPage(props) {
  return (
    <DocumentsManager
      model="containers"
      increments={32}
      initialFilters={{
        status: "pending",
        keyword: "",
        direction: "outgoing",
        from_date: null,
        to_date: null,
      }}
      sortOptions={["-timestamps.updated", "timestamps.updated"]}
      initialSort="-timestamps.updated"
      DocumentCard={ContainerCard}
      LoadingCard={(props) => (
        <CardSkeleton partsCount={6} type={2} {...props} />
      )}></DocumentsManager>
  );
}

export default withCatch(ContainersPage);
