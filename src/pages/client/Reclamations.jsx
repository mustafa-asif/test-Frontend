import { useEffect } from "react";
import { SButton } from "../../components/shared/Button";
import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { withCatch } from "../../components/shared/SafePage";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { sortByAwaitingReply } from "../../utils/misc";
import { useTranslation } from "../../i18n/provider";
import { ReclamationCard } from "../../components/client/ReclamationCard";

function ReclamationsPage(props) {
  const tl = useTranslation();

  useEffect(() => {}, []);

  return (
    <DocumentsManager
      model="tickets"
      initialFilters={{ status: "all", keyword: "", from_date: null, to_date: null }}
      DocumentCard={ReclamationCard}
      processDocuments={sortByAwaitingReply}
      sortOptions={["-timestamps.created", "timestamps.created", "timestamps.last_staff_message"]}
      initialSort="-timestamps.created"
      LoadingCard={(props) => <CardSkeleton partsCount={6} type={2} {...props} />}
    >
      <SButton href="/tickets/add" label={tl("open_reclamation")} />
    </DocumentsManager>
  );
}

export default withCatch(ReclamationsPage);
