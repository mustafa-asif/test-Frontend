import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { ProductCard } from "../../components/followup/ProductCard";
import { withCatch } from "../../components/shared/SafePage";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { ItemsCount } from "../../components/shared/ItemsCount";

function ProductsPage(props) {

  return (
    <DocumentsManager
      model="products"
      increments={40}
      processDocuments={groupByClient}
      initialFilters={{ keyword: "", productStatus: "all",warehouse:"all" }}
      DocumentCard={ProductCard}
      LoadingCard={(props) => <CardSkeleton partsCount={6} type={2} {...props} />}
      refreshOnVisit>
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
