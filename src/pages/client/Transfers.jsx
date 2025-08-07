import { useState, useEffect } from "react";
import { YoutubeDialog } from "../../components/shared/YoutubeDialog";
import { SButton } from "../../components/shared/Button";
import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { TransferCard } from "../../components/client/TransferCard";
import { withCatch } from "../../components/shared/SafePage";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { sortByAwaitingReply } from "../../utils/misc";
import { useTranslation } from "../../i18n/provider";

function TransfersPage(props) {
  const tl = useTranslation();

  const [openYoutube, setOpenYoutube] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("YT_TRANSFERS") < 2) {
      setOpenYoutube(true);
      localStorage.setItem(
        "YT_TRANSFERS",
        (parseInt(localStorage.getItem("YT_TRANSFERS")) || 0) + 1
      );
    }
  }, []);

  return (
    <DocumentsManager
      model="transfers"
      initialFilters={{ status: "all", keyword: "", from_date: null, to_date: null }}
      DocumentCard={TransferCard}
      processDocuments={sortByAwaitingReply}
      sortOptions={["-timestamps.updated", "timestamps.updated", "-timestamps.last_staff_message"]}
      initialSort="-timestamps.updated"
      LoadingCard={(props) => <CardSkeleton partsCount={6} type={2} {...props} />}>
      <SButton href="/transfers/add" label={tl("add_transfer")} />
      <YoutubeDialog
        video="d2y3QesZHTw"
        playlist="d2y3QesZHTw"
        open={openYoutube}
        setOpen={setOpenYoutube}
      />
    </DocumentsManager>
  );
}

export default withCatch(TransfersPage);
