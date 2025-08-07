import { useStoreState } from "easy-peasy";
import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { ProductCard } from "../../components/warehouse/ProductCard";
import { withCatch } from "../../components/shared/SafePage";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { SButton } from "../../components/shared/Button";
import { useTranslation } from "../../i18n/provider";
import { ItemsCount } from "../../components/shared/ItemsCount";

function ProductsPage(props) {
  const user = useStoreState((state) => state.auth.user);
  const { warehouse } = user;
  const canPickup = warehouse.main || warehouse.options.pickups;
  const tl = useTranslation();

  return (
    <DocumentsManager
      model="products"
      increments={40}
      processDocuments={groupByClient}
      initialFilters={{ keyword: "", productStatus: "all", warehouseUser: "all", inventoryScan: "all"}}
      DocumentCard={ProductCard}
      LoadingCard={(props) => <CardSkeleton partsCount={6} type={2} {...props} />}
      refreshOnVisit>
      {canPickup && <SButton href="/products/add" label={tl("create_labels")} />}
      <ItemsCount />
    </DocumentsManager>
  );
}

export default withCatch(ProductsPage);

function groupByClient(products) {
  const clients = {};

  for (const product of products) {
    clients[product.client._id] ??= {
      _id: product.client._id,
      client: product.client,
      products: [],
    };
    clients[product.client._id].products.push(product);
  }

  return Object.values(clients);
}
