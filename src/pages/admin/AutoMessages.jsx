import {  SButton } from "../../components/shared/Button";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { withCatch } from "../../components/shared/SafePage";
import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { AutoMessageCard } from "../../components/admin/AutoMessageCard";

function AutoMessagesPage() {
  return (
    <DocumentsManager
      model="autoMessages"
      DocumentCard={AutoMessageCard}
      LoadingCard={(props) => <CardSkeleton partsCount={4} type={2} {...props} />}
      refreshOnVisit>
      <SButton href="/auto-messages/add" label="Add Auto Message" />
    </DocumentsManager>
  );
}

export default withCatch(AutoMessagesPage);
