import { ActionsMenu } from "../shared/ActionsMenu";
import { Copyable } from "../shared/Copyable";
import { ClientDisplay } from "../shared/ClientDisplay";
import { ProductsDisplay } from "../shared/ProductsDisplay";
import { MessagesButton } from "../shared/MessagesButton";
import { HumanDate } from "../shared/HumanDate";
import { useQuickEditor } from "../shared/ToolsProvider";
import { CardDatePicker } from "../shared/CardDatePicker";
import { Pin } from "../shared/Pin";
import { CostDisplay } from "../shared/CostDisplay";
import { TargetDisplay } from "../shared/TargetDisplay";
import { Card } from "../shared/Card";
import { getMostRecentTimestamp } from "../../utils/misc";
import { Tags } from "../shared/Tags";

export const OrderCard = ({
  _id,
  cost,
  target,
  products,
  status,
  desired_date,
  timestamps,
  timeline,
  messages,
  pinned,
  client,
  tags,
  locked_items,
  isView,
  ...rest
}) => {
  const [isSaving, editDocument, deleteDocument] = useQuickEditor(_id, "orders");

  return (
    <Card loading={isSaving}>
      <div className="grid grid-cols-4 gap-2">
        <div className="col-span-4 flex items-center justify-between whitespace-nowrap">
          <div className="flex items-center gap-x-2">
            <span className="text-sm font-light text-gray-400 hover:text-green-500">
              <Copyable text={_id} />
            </span>
            <Tags
              value={tags}
              onChange={(tags) => editDocument({ tags })}
              isLoading={isSaving}
              canEdit
            />
          </div>
          <div className="flex items-center">
            <span className="text-sm font-light text-gray-400">
              <HumanDate date={getMostRecentTimestamp(timestamps)} long />
            </span>
            <Pin value={pinned} onChange={(pinned) => editDocument({ pinned })} />
          </div>
        </div>

        <TargetDisplay target={target} status={status} showComments hideNumber />
        <ClientDisplay client={client} />
        <ProductsDisplay products={products} />
        <MessagesButton
          messages={messages}
          status={status}
          link={`${isView ? "/view/" : "/"}orders/${_id}/chat`}
        />
        <CardDatePicker
          date={desired_date}
          editDocument={editDocument}
          disabled={isSaving || timestamps.cancelled || timestamps.fulfilled}
          _id={_id}
          model="orders"
          opensMessages={typeof status === "string"} // certain statuses
        />
        <CostDisplay cost={cost} />

        <ActionsMenu
          _id={_id}
          editDocument={editDocument}
          deleteDocument={deleteDocument}
          model="orders"
          status={status}
          pending={status === "in progress"}
          inprogress={status === "pending" || status === "problem"}
          refused={status === "in progress"}
          fulfilled={status === "in progress"}
          cancelled={status === "pending" || status === "in progress" || status === "problem"}
          problem={status === "pending" || status === "in progress"}
          history={false}
          products={products}
          opensMessages={["cancelled", "refused", "draft"]}
          target={target}
          skipItemsOnFulfill={locked_items}
          isView={isView}
        />
      </div>
    </Card>
  );
};
