import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { withCatch } from "../../components/shared/SafePage";
import { BasicDocumentsManager } from "../../components/shared/BasicDocumentsManager";
import { DoubleTransferCard } from "../../components/followup/DoubleTransferCard";

function DebugPage(props) {
  return (
    <BasicDocumentsManager
      DocumentCard={DoubleTransferCard}
      resourceRoute="/debug/double-transfers"
      title="Double Transfers"
      LoadingCard={(props) => (
        <CardSkeleton partsCount={6} type={2} {...props} />
      )}></BasicDocumentsManager>
  );
}

export default withCatch(DebugPage);
