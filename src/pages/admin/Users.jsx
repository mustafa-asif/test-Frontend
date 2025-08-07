import { SButton } from "../../components/shared/Button";
import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { withCatch } from "../../components/shared/SafePage";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { UserCard } from "../../components/admin/UserCard";

function UsersPage(props) {
  return (
    <DocumentsManager
      model="users"
      increments={32}
      initialFilters={{ keyword: "" }}
      DocumentCard={UserCard}
      LoadingCard={(props) => <CardSkeleton partsCount={4} type={2} {...props} />}>
      <SButton href="/users/add" label="Add User" />
    </DocumentsManager>
  );
}

export default withCatch(UsersPage);
