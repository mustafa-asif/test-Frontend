import { Fragment } from "react";
import { ResetButton } from "../../components/admin/ResetButton";
import { SnapshotCard } from "../../components/admin/SnapshotCard";
import { Button, SButton } from "../../components/shared/Button";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { withCatch } from "../../components/shared/SafePage";
import { CardSkeleton } from "../../components/skeletons/CardSkeleton";

function SnapshotsPage() {
  return (
    <DocumentsManager
      model="snapshots"
      DocumentCard={SnapshotCard}
      LoadingCard={(props) => <CardSkeleton partsCount={4} type={2} {...props} />}
      refreshOnVisit>
      <SButton href="/snapshots/add" label="Create Snapshot" />
      <ResetButton />
    </DocumentsManager>
  );
}

export default withCatch(SnapshotsPage);
