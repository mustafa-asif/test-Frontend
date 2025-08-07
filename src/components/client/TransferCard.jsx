import { Link } from "react-router-dom";
import { ActionsMenu } from "../shared/ActionsMenu";
import { Copyable } from "../shared/Copyable";
import { ProductsDisplay } from "../shared/ProductsDisplay";
import { MessagesButton } from "../shared/MessagesButton";
import { HumanDate } from "../shared/HumanDate";
import { Card } from "../shared/Card";
import { useQuickEditor } from "../shared/ToolsProvider";
import { getMostRecentTimestamp } from "../../utils/misc";

export const TransferCard = ({
  _id,
  timestamps,
  products,
  from_city,
  to_city,
  messages,
  order,
  status,
}) => {
  const [isSaving, editDocument, deleteDocument] = useQuickEditor(_id, "transfers");

  return (
    <Card loading={isSaving}>
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-full text-sm font-light text-gray-400 hover:text-green-500 flex items-center col-span-2 -mt-1 cursor-pointer">
          <Copyable text={_id} />
        </div>
        <div className="rounded-full text-sm font-light text-gray-400 flex items-center col-span-2 justify-end -mt-1">
          <HumanDate date={getMostRecentTimestamp(timestamps)} long />
        </div>

        <ProductsDisplay products={products} />

        <div className="rounded-full h-10 flex items-center col-span-4 bg-gray-100 shadow-sm justify-center capitalize">
          <span className="text-red-500">{from_city}</span>
          <i className="fas fa-arrow-right mx-3"></i>
          <span className="text-green-500">{to_city}</span>
        </div>

        <MessagesButton
          messages={messages}
          status={status}
          link={`/transfers/${_id}/chat`}
        />

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
          remove={status === "cancelled" || status === "pending"}
        />
      </div>
    </Card>
  );
};
