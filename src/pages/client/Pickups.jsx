import { useState, useEffect } from "react";
import { YoutubeDialog } from "../../components/shared/YoutubeDialog";
import { SButton } from "../../components/shared/Button";
import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { PickupCard } from "../../components/client/PickupCard";
import { withCatch } from "../../components/shared/SafePage";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { sortByAwaitingReply } from "../../utils/misc";
import { useTranslation } from "../../i18n/provider";

function PickupsPage(props) {
  const tl = useTranslation();

  const [openYoutube, setOpenYoutube] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("YT_FIRST") < 2) {
      setOpenYoutube(true);
      localStorage.setItem("YT_FIRST", (parseInt(localStorage.getItem("YT_FIRST")) || 0) + 1);
    }
  }, []);

  return (
    <DocumentsManager
      model="pickups"
      initialFilters={{ status: "all", keyword: "", from_date: null, to_date: null }}
      DocumentCard={PickupCard}
      processDocuments={sortByAwaitingReply}
      sortOptions={["-timestamps.updated", "timestamps.updated", "timestamps.last_staff_message"]}
      initialSort="-timestamps.updated"
      LoadingCard={(props) => <CardSkeleton partsCount={4} type={2} {...props} />}>
      <SButton href="/pickups/add" label={tl("add_pickup")} />
      <YoutubeDialog
        video="72vnh8J5gJ0"
        playlist="72vnh8J5gJ0"
        open={openYoutube}
        setOpen={setOpenYoutube}
      />
    </DocumentsManager>
  );
}

export default withCatch(PickupsPage);
