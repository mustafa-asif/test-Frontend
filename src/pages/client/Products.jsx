import { useState, useEffect } from "react";
import { YoutubeDialog } from "../../components/shared/YoutubeDialog";
import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { ProductCard } from "../../components/client/ProductCard";
import { withCatch } from "../../components/shared/SafePage";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { SButton } from "../../components/shared/Button";
import { useTranslation } from "../../i18n/provider";
import { ItemsCount } from "../../components/shared/ItemsCount";
import { useStoreState } from "easy-peasy";

function ProductsPage(props) {
  const tl = useTranslation();

  const lock_items = useStoreState((state) => state.auth.user.client.lock_items);

  const [openYoutube, setOpenYoutube] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("YT_FIRST") < 2) {
      setOpenYoutube(true);
      localStorage.setItem("YT_FIRST", (parseInt(localStorage.getItem("YT_FIRST")) || 0) + 1);
    }
  }, []);

  return (
    <DocumentsManager
      model="products"
      increments={40}
      initialFilters={{ keyword: "" }}
      DocumentCard={ProductCard}
      LoadingCard={(props) => <CardSkeleton partsCount={4} type={1} {...props} />}
      refreshOnVisit>
      {!lock_items && <SButton href="/products/add" label={tl("add_products")} />}
      <ItemsCount />
      <YoutubeDialog
        video="72vnh8J5gJ0"
        playlist="72vnh8J5gJ0"
        open={openYoutube}
        setOpen={setOpenYoutube}
      />
    </DocumentsManager>
  );
}

export default withCatch(ProductsPage);
