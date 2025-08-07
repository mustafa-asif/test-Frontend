import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { ClientCard } from "../../components/commercial/ClientCard";
import { withCatch } from "../../components/shared/SafePage";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { SButton } from "../../components/shared/Button";

function ClientsPage(props) {
  return (
    <DocumentsManager
      model="clients"
      increments={32}
      initialFilters={{
        status: "inactive",
        keyword: "",
        tags: "all",
        from_date: null,
        to_date: null,
      }}
      sortOptions={["-timestamps.created", "timestamps.created"]}
      initialSort="-timestamps.created"
      DocumentCard={ClientCard}
      LoadingCard={(props) => <CardSkeleton partsCount={6} type={2} {...props} />}>
      <SButton icon="eject" iconColor="gray" href="/clients/migrate-pack" label="Migrate Pack" />
    </DocumentsManager>
  );
}

export default withCatch(ClientsPage);
