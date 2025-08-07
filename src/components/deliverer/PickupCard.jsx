import { ActionsMenu } from "../shared/ActionsMenu";
import { Card } from "../shared/Card";
import { CardDatePicker } from "../shared/CardDatePicker";
import { Copyable } from "../shared/Copyable";
import { UserDisplay } from "../shared/UserDisplay";
import { HumanDate } from "../shared/HumanDate";
import { MessagesButton } from "../shared/MessagesButton";
import { Pin } from "../shared/Pin";
import { ClientDisplay } from "../shared/ClientDisplay";
import { ProductsDisplay } from "../shared/ProductsDisplay";
import { TargetDisplay } from "../shared/TargetDisplay";
import { useQuickEditor } from "../shared/ToolsProvider";
import { getMostRecentTimestamp } from "../../utils/misc";
import { Tags } from "../shared/Tags";
import { PackagingSelect } from "../shared/PackagingSelect";

export const PickupCard = ({
  _id,
  pinned,
  timestamps,
  type,
  target,
  products,
  messages,
  status,
  desired_date,
  client,
  tags,
  needs_packaging,
  packaging_type,
  items_count,
  ...rest
}) => {
  const [isSaving, editDocument, deleteDocument] = useQuickEditor(_id, "pickups");

  const sum = products?.reduce((count, product) => count + product.quantity, 0);

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

        <TargetDisplay target={target} status={status} />
        <ClientDisplay client={client} />
        {products?.length > 0 && <ProductsDisplay products={products} showRefrs />}
        {needs_packaging && <PackagingSelect value={packaging_type} disabled={isSaving} />}
        <MessagesButton messages={messages} status={status} link={`/pickups/${_id}/chat`} />

        <CardDatePicker
          date={desired_date}
          editDocument={editDocument}
          disabled={isSaving || timestamps.cancelled || timestamps.fulfilled}
          _id={_id}
          model="pickups"
          opensMessages={typeof status === "string"} // certain statuses
        />

        {["fulfilled", "fulfilling"].includes(status) ? (
          <div className="rounded-full h-10 text-lg flex items-center col-span-1 font-bold bg-green-50 text-green-500 border border-solid border-green-100 justify-center">
            {sum ? sum : items_count ? `${items_count}` : "?"}
          </div>
        ) : (
          <div className="rounded-full h-10 text-lg flex items-center col-span-1 font-bold bg-yellow-50 text-yellow-500 border border-solid border-yellow-100 justify-center">
            {items_count ?? "?"}
          </div>
        )}

        <ActionsMenu
          _id={_id}
          editDocument={editDocument}
          deleteDocument={deleteDocument}
          model="pickups"
          status={status}
          pending={status === "in progress" || status === "fulfilling"}
          // fulfilling={status === "in progress"}
          inprogress={status === "pending" || status === "problem"}
          cancelled={status === "pending" || status === "problem"}
          problem={status === "pending"}
          history={false}
          opensMessages={["cancelled", "problem"]}
        />
      </div>
    </Card>
  );
};
