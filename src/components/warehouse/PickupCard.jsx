import { ActionsMenu } from "../shared/ActionsMenu";
import { Card } from "../shared/Card";
import { CardDatePicker } from "../shared/CardDatePicker";
import { Copyable } from "../shared/Copyable";
import { HumanDate } from "../shared/HumanDate";
import { MessagesButton } from "../shared/MessagesButton";
import { Pin } from "../shared/Pin";
import { ClientDisplay } from "../shared/ClientDisplay";
import { ProductsDisplay } from "../shared/ProductsDisplay";
import { TargetDisplay } from "../shared/TargetDisplay";
import { usePrint, useQuickEditor } from "../shared/ToolsProvider";
import { Button } from "../shared/Button";
import { getMostRecentTimestamp } from "../../utils/misc";
import { useTranslation } from "../../i18n/provider";
import { DelivererSelect } from "./DelivererSelect";
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
  deliverer,
  desired_date,
  client,
  items,
  tags,
  needs_packaging,
  packaging_type,
  items_count,
  events,
}) => {
  const [isSaving, editDocument, deleteDocument] = useQuickEditor(_id, "pickups");
  const sum = products?.reduce((count, product) => count + product.quantity, 0) || 0;
  const showPrint = usePrint();
  const tl = useTranslation();
  const name = getPickupCreatedAgent(status, events);

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

        {type === "paid" && <TargetDisplay target={target} status={status} />}

        <ClientDisplay client={client} />

        {products?.length > 0 && <ProductsDisplay products={products} showRefrs />}

        {needs_packaging && (
          <PackagingSelect
            value={packaging_type}
            disabled={isSaving}
            onChange={(packaging_type) => editDocument({ packaging_type })}
            canEdit
          />
        )}

        {type === "paid" && (
          <DelivererSelect _id={_id} model={"pickups"} status={status} deliverer={deliverer} />
        )}

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
          pending={status === "problem" || status === "in progress"}
          edit={status === "pending" || status === "in progress"}
          fulfilled={status === "in progress" || status === "fulfilling"}
          cancelled={status === "pending" || status === "in progress" || status === "problem"}
          problem={status === "pending"}
          opensMessages={["cancelled", "problem"]}
          items_count={items_count}
        />

        {status === "fulfilled" && (
          <Button
            label={tl("print_labels")}
            type="button"
            btnColor="gray"
            icon="print"
            className="col-span-4"
            onClick={() => showPrint(items)}
          />
        )}
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