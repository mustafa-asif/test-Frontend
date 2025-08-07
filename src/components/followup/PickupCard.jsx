import { ActionsMenu } from "../shared/ActionsMenu";
import { Card } from "../shared/Card";
import { CardDatePicker } from "../shared/CardDatePicker";
import { Copyable } from "../shared/Copyable";
import { HumanDate } from "../shared/HumanDate";
import { MessagesButton } from "../shared/MessagesButton";
import { Pin } from "../shared/Pin";
import { ProductsDisplay } from "../shared/ProductsDisplay";
import { TargetDisplay } from "../shared/TargetDisplay";
import { useQuickEditor } from "../shared/ToolsProvider";
import { ClientDisplay } from "../shared/ClientDisplay";
import { getMostRecentTimestamp } from "../../utils/misc";
import { Tags } from "../shared/Tags";
import { JsonViewButton } from "../shared/JsonViewer";
import { PackagingSelect } from "../shared/PackagingSelect";

export const PickupCard = ({
  _id,
  target,
  status,
  messages,
  desired_date,
  client,
  products,
  deliverer,
  pinned,
  timestamps,
  type,
  items,
  needs_packaging,
  packaging_type,
  items_count,
  tags,
  events,
  ...rest
}) => {
  const [isSaving, editDocument, deleteDocument] = useQuickEditor(_id, "pickups");
  const sum = products?.reduce((count, product) => count + product.quantity, 0) || 0;
  const name = getPickupCreatedAgent(status, events);

  return (
    <Card loading={isSaving}>
      <div className="grid grid-cols-4 gap-2">
        {/*  */}
        <div className="col-span-4 flex justify-between items-center whitespace-nowrap gap-x-1">
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
            <JsonViewButton model="pickups" _id={_id} />
          </div>
        </div>

        {type === "free" && (
          <div className="rounded-full h-10 flex items-center col-span-4 bg-gray-100 shadow-sm justify-center capitalize">
            {"sur place"}
          </div>
        )}

        {name && (
          <div className="rounded-full h-10 flex items-center col-span-4 text-sm font-medium text-gray-600 bg-gray-50 border border-solid border-gray-100 px-3">
            <i className="fas fa-user pr-2"></i>
            {name}
          </div>
        )}

        {type === "paid" && <TargetDisplay target={target} status={status} deliverer={deliverer} />}

        <ClientDisplay client={client} />

        {products?.length > 0 && <ProductsDisplay products={products} showRefrs />}
        {needs_packaging && <PackagingSelect value={packaging_type} disabled={isSaving} />}

        <MessagesButton messages={messages ?? []} status={status} link={`/pickups/${_id}/chat`} />

        {type === "paid" && (
          <CardDatePicker
            date={desired_date}
            editDocument={editDocument}
            disabled={isSaving || timestamps.cancelled || timestamps.fulfilled}
            _id={_id}
            model="pickups"
            opensMessages={typeof status === "string"} // certain statuses
          />
        )}

        {["fulfilled", "fulfilling"].includes(status) ? (
          <div
            className={`rounded-full h-10 text-lg flex items-center ${
              type === "free" ? "col-span-2" : "col-span-1"
            } font-bold bg-green-50 text-green-500 border border-solid border-green-100 justify-center`}>
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
          pending={status === "problem"}
          edit={status === "pending" || status === "in progress" || status === "problem"}
          cancelled={status === "pending" || status === "problem"}
          opensMessages={["cancelled", "problem"]}
        />
      </div>
    </Card>
  );
};

function getPickupCreatedAgent(status, events) {
  if (!Array.isArray(events)) {
    return null
  }

  if (status !== 'fulfilled') {
    return null
  }

  const event = events.find((e) => e.en === 'Pickup Created');
  if (!event) {
    return null
  }

  return event.user?.name;
}