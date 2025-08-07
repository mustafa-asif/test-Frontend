import { useEffect } from "react";
import { SButton } from "../../components/shared/Button";
import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { withCatch } from "../../components/shared/SafePage";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { sortByAwaitingReply } from "../../utils/misc";
import { ReclamationCard } from "../../components/followup/ReclamationCard";

function ReclamationsPage(props) {
  return (
    <DocumentsManager
      model="tickets"
      initialFilters={
        {
          status: "all",
          keyword: "",
          from_date: null,
          to_date: null,
          tags: "all",
          action: "all",
          thumbs: "all",
          supportRating: "all",
          supportCategory: "all",
          supportSubCategory: "all",
        }}
      DocumentCard={ReclamationCard}
      processDocuments={sortByAwaitingReply}
      sortOptions={["-timestamps.created", "timestamps.created", "timestamps.last_client_message"]}
      initialSort="-timestamps.created"
      LoadingCard={(props) => (
        <CardSkeleton partsCount={6} type={2} {...props} />
      )}></DocumentsManager>
  );
}

export default withCatch(ReclamationsPage);
