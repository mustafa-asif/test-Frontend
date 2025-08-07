import { CardDatePicker } from "../shared/CardDatePicker";
import { TargetDisplay } from "../shared/TargetDisplay";
import { Copyable } from "../shared/Copyable";
import { ClientDisplay } from "../shared/ClientDisplay";
import { ProductsDisplay } from "../shared/ProductsDisplay";
import { HumanDate } from "../shared/HumanDate";
import { Card } from "../shared/Card";
import { useQuickEditor } from "../shared/ToolsProvider";
import { Pin } from "../shared/Pin";
import { getMostRecentTimestamp } from "../../utils/misc";
import { ActionsMenu } from "../shared/ActionsMenu";
import { MessagesButton } from "../shared/MessagesButton";

export const ReturnCard = ({
  _id,
  timestamps,
  description,
  target,
  products,
  status,
  desired_date,
  client,
  messages,
}) => {
  const [isSaving, editDocument] = useQuickEditor(_id, "purges");

  return (
    <Card loading={isSaving}>
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-full text-sm font-light text-gray-400 hover:text-green-500 flex items-center col-span-2 -mt-1">
          <Copyable text={_id} />
        </div>
        <div className="rounded-full text-sm font-light text-gray-400 flex items-center col-span-2 justify-end -mt-1">
          <HumanDate date={getMostRecentTimestamp(timestamps)} long />
        </div>

        <ClientDisplay client={client} />

        <TargetDisplay target={target} status={status} />

        {products?.length > 0 && <ProductsDisplay products={products} showRefrs />}

        <div className="col-span-4">{description}</div>

        <MessagesButton messages={messages} status={status} link={`/returns/${_id}/chat`} />

        <CardDatePicker
          date={desired_date}
          editDocument={editDocument}
          disabled={isSaving || timestamps.cancelled || timestamps.fulfilled}
          _id={_id}
          model="purges"
          opensMessages={typeof status === "string"} // certain statuses
        />

        <ActionsMenu
          _id={_id}
          editDocument={editDocument}
          model="purges"
          status={status}
          pending={status === "in progress"}
          inprogress={status === "pending"}
          fulfilled={status === "in progress"}
          history={false}
        />
      </div>
    </Card>
  );
};
