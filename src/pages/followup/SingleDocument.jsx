import { Fragment, useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { IconButton } from "../../components/shared/Button";
import { useGoBack } from "../../components/shared/LastLocation";
import { NothingCard } from "../../components/shared/NothingCard";
import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { useToast } from "../../hooks/useToast";
import { xFetch } from "../../utils/constants";
import { OrderCard } from "../../components/followup/OrderCard";
import { CycleCard } from "../../components/shared/CycleCard";
import { ItemCard } from "../../components/shared/ItemCard";
import { PickupCard } from "../../components/followup/PickupCard";
import { TransferCard } from "../../components/followup/TransferCard";
import { useStoreState, useStoreActions } from "easy-peasy";

export default function SingleDocument(props) {
  const { id, model } = useParams();

  const showToast = useToast();
  const goBack = useGoBack(`/${model}`);

  const documents = useStoreState((state) => state[model][model]);
  const document = documents.find((doc) => doc._id === id);
  const addDocument = useStoreActions(
    (actions) => actions[model][`add${model[0].toUpperCase() + model.slice(1, -1)}`]
  );

  const [isLoading, setLoading] = useState(!document);

  const DocumentCard = getDocumentCard(model);

  async function fetchDocument() {
    setLoading(true);
    const { data, error } = await xFetch(`/${model}/${id}`);
    setLoading(false);
    if (error) {
      return showToast(error, "error");
    }
    if (data) addDocument(data);
  }

  useEffect(() => {
    if (!document) fetchDocument();
  }, [id, model]);

  return (
    <Fragment>
      <div className="relative pb-32" style={{ marginTop: -65, paddingTop: 75 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 w-full px-4 md:px-10">
          <IconButton icon="arrow-left" className="mr-3" iconColor="gray" onClick={goBack} />
        </div>
        <div
          className="absolute bg-gradient-to-r from-gray-500 to-gray-600 left-0 right-0"
          style={{ top: -600, bottom: -75, zIndex: -1 }}></div>
      </div>
      <div className="relative px-4 md:px-10 mx-auto w-full -mt-24 mb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 w-full pb-6 overflow-hidden">
          {isLoading && (
            <CardSkeleton
              partsCount={["orders", "pickups", "item"].includes(model) ? 6 : 2}
              type={2}
            />
          )}
          {document && <DocumentCard {...document} />}
          {!isLoading && !document && (
            <NothingCard>
              <p>Not Found</p>
            </NothingCard>
          )}
        </div>
      </div>
    </Fragment>
  );
}

function getDocumentCard(model) {
  switch (model) {
    case "orders":
      return OrderCard;
    case "cycles":
      return CycleCard;
    case "pickups":
      return PickupCard;
    case "transfers":
      return TransferCard;
    case "items":
      return ItemCard;
    default:
      return () => <div>unexpected model: {model}</div>;
  }
}
