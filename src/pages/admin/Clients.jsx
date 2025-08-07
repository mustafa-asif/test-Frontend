import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { ClientCard } from "../../components/admin/ClientCard";
import { withCatch } from "../../components/shared/SafePage";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { SButton } from "../../components/shared/Button";

function ClientsPage(props) {
  return (
    <DocumentsManager
      model="clients"
      increments={32}
      initialFilters={{ status: "active", keyword: "" }}
      DocumentCard={ClientCard}
      LoadingCard={(props) => <CardSkeleton partsCount={6} type={2} {...props} />}>
      <SButton icon="eject" iconColor="gray" href="/clients/migrate-pack" label="Migrate Pack" />
    </DocumentsManager>
  );
}

export default withCatch(ClientsPage);
