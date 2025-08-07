import { Fragment } from "react";
import { BannerCard } from "../../components/admin/BannerCard";
import { Button, SButton } from "../../components/shared/Button";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { withCatch } from "../../components/shared/SafePage";
import { CardSkeleton } from "../../components/skeletons/CardSkeleton";

function BannersPage() {
  return (
    <DocumentsManager
      model="banners"
      DocumentCard={BannerCard}
      LoadingCard={(props) => <CardSkeleton partsCount={4} type={2} {...props} />}
      refreshOnVisit>
      <SButton href="/banners/add" label="Create Banner" />
    </DocumentsManager>
  );
}

export default withCatch(BannersPage);
