import {  SButton } from "../../components/shared/Button";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { withCatch } from "../../components/shared/SafePage";
import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { SupportCategoryCard } from "../../components/admin/SupportCategoryCard";

function SupportCategoriesPage() {
  return (
    <DocumentsManager
      model="supportCategories"
      DocumentCard={SupportCategoryCard}
      LoadingCard={(props) => <CardSkeleton partsCount={4} type={2} {...props} />}
      refreshOnVisit>
      <SButton href="/support-categories/add" label="Create Support Category" />
    </DocumentsManager>
  );
}

export default withCatch(SupportCategoriesPage);
