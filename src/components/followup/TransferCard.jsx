import { Link } from "react-router-dom";
import { getMostRecentTimestamp } from "../../utils/misc";
import { ActionsMenu } from "../shared/ActionsMenu";
import { Card } from "../shared/Card";
import { Copyable } from "../shared/Copyable";
import { HumanDate } from "../shared/HumanDate";
import { MessagesButton } from "../shared/MessagesButton";
import { Pin } from "../shared/Pin";
import { ProductsDisplay } from "../shared/ProductsDisplay";
import { useQuickEditor } from "../shared/ToolsProvider";
import { Tags } from "../shared/Tags";
import { JsonViewButton } from "../shared/JsonViewer";

export const TransferCard = ({
  _id,
  timestamps,
  products,
  from_city,
  to_city,
  to_warehouse,
  messages,
  order,
  status,
  pinned,
  tags,
}) => {
  const [isSaving, editDocument, deleteDocument] = useQuickEditor(_id, "transfers");

  return (
    <Card loading={isSaving}>
      <div className="grid grid-cols-4 gap-2">
        <div className="col-span-4 flex items-center justify-between whitespace-nowrap gap-x-1">
          <div className="flex items-center gap-x-2">
            <span className="font-light text-sm text-gray-400 hover:text-green-500">
              <Copyable text={_id} />
            </span>
            <Tags
              value={tags}
              onChange={(tags) => editDocument({ tags })}
              isLoading={isSaving}
              canEdit
              canRemove
            />
          </div>
          <div className="flex items-center">
            <span className="font-light text-sm text-gray-400">
              <HumanDate date={getMostRecentTimestamp(timestamps)} long />
            </span>
            <Pin value={pinned} onChange={(pinned) => editDocument({ pinned })} />
            <JsonViewButton model="transfers" _id={_id} />
          </div>
        </div>

        <ProductsDisplay products={products} showRefrs />

        <div className="rounded-full h-10 flex items-center col-span-4 bg-gray-100 shadow-sm justify-center capitalize">
          <span className="text-red-500">{from_city}</span>
          <i className="fas fa-arrow-right mx-3"></i>
          <span className="text-green-500">
            {to_city} {to_warehouse && <>({to_warehouse.name})</>}
          </span>
        </div>

        <MessagesButton messages={messages} status={status} link={`/transfers/${_id}/chat`} />

        {order && (
          <Link
            to={`/view/orders/${order._id}`}
            className="rounded-full h-10 flex col-span-2 items-center text-gray-500 bg-yellow-100 shadow-sm justify-center capitalize cursor-pointer">
            <i className="fas fa-motorcycle"></i>
          </Link>
        )}

        <ActionsMenu
          _id={_id}
          model="transfers"
          editDocument={editDocument}
          deleteDocument={deleteDocument}
          status={status}
          fulfilled={status === "in progress"}
          forceFulfilled={status === "in progress"}
        />
      </div>
    </Card>
  );
};
