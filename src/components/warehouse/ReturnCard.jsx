import { Copyable } from "../shared/Copyable";
import { CardDatePicker } from "../shared/CardDatePicker";
import { TargetDisplay } from "../shared/TargetDisplay";
import { DelivererSelect } from "./DelivererSelect";
import { ClientDisplay } from "../shared/ClientDisplay";
import { ProductsDisplay } from "../shared/ProductsDisplay";
import { HumanDate } from "../shared/HumanDate";
import { Card } from "../shared/Card";
import { usePrint, useQuickEditor } from "../shared/ToolsProvider";
import { cl, getMostRecentTimestamp } from "../../utils/misc";
import { ActionsMenu } from "../shared/ActionsMenu";
import { Checkbox, Switch } from "@mui/material";
import { MessagesButton } from "../shared/MessagesButton";
import { useStoreActions, useStoreState } from "easy-peasy";
import { PrintButton } from "./PrintButton";
import { Button } from "../shared/Button";
import { useTranslation } from "../../i18n/provider";

export const ReturnCard = ({
  _id,
  timestamps,
  description,
  kind = "onsite",
  target,
  products,
  status = "fulfilled",
  deliverer,
  desired_date,
  client,
  items,
  created_by,
  show_client,
  messages,
  is_printed,
  events,
}) => {
  const [isSaving, editDocument] = useQuickEditor(_id, "purges");
  const name = getReturnedUserName(status, events);

  async function toggleShowClient() {
    await editDocument({ show_client: !show_client });
  }

  const setSelectedPurges = useStoreActions((actions) => actions["purges"].setSelectedPurges);
  const selected_purges = useStoreState((state) => state["purges"].selected_ids);

  function handleSelect() {
    setSelectedPurges({
      _id,
      client: client
    });
  }

  const showPrint = usePrint();
  const tl = useTranslation();

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

        {name && (
          <div className="rounded-full h-10 flex items-center col-span-4 text-sm font-medium text-gray-600 bg-gray-50 border border-solid border-gray-100 px-3">
            <i className="fas fa-user pr-2"></i>
            {name}
          </div>
        )}

        {kind === "onsite" && (
          <div className="rounded-full h-10 flex items-center gap-[5px] col-span-4 bg-gray-100 shadow-sm justify-center capitalize">
            <i className="fas fa-warehouse pr-1"></i>
            {"sur place"}
          </div>
        )}
        {kind === "delivered" && (
          <div className="rounded-full h-10 flex items-center gap-[5px] col-span-4 bg-gray-100 shadow-sm justify-center capitalize">
            <i className="fas fa-motorcycle pr-1"></i>
            {"livraison"}
          </div>
        )}

        {kind === "delivered" && <TargetDisplay target={target} status={status} />}

        {products?.length > 0 && <ProductsDisplay products={products} showRefrs />}
        <div className="col-span-4">{description}</div>
        {kind === "delivered" && (
          <DelivererSelect _id={_id} model={"purges"} status={status} deliverer={deliverer} />
        )}

        <MessagesButton messages={messages} status={status} link={`/returns/${_id}/chat`} />


        {/* Quantity of return items */}
        <div className={`relative rounded-full h-10 flex items-center justify-center px-2 shadow-sm bg-gray-100 text-green-500`}>
          {items.length}
        </div>
        {/* Quantity of return items */}


        {kind === "delivered" && (
          <CardDatePicker
            date={desired_date}
            editDocument={editDocument}
            disabled={isSaving || timestamps.cancelled || timestamps.fulfilled}
            _id={_id}
            model="purges"
            opensMessages={typeof status === "string"} // certain statuses
          />
        )}
        <div
          className={cl(
            "col-span-2 flex h-10 items-center bg-gray-200 rounded-full",
            { "justify-center": created_by === "client" },
            { "justify-start": created_by !== "client" }
          )}>
          <div className={cl({ hidden: created_by === "client" })}>
            <Switch checked={show_client} onChange={toggleShowClient} disabled={isSaving} />
          </div>
          <p
            className={cl(
              "text-sm font-semibold",
              { "text-red-600": !show_client },
              { "text-green-600": show_client }
            )}>
            {show_client ? "Visible Client" : "Caché Client"}
          </p>
        </div>

        <PrintButton handleSelect={handleSelect} is_printed={is_printed} selected_purges={selected_purges} client={client} />

        <ActionsMenu
          _id={_id}
          editDocument={editDocument}
          model="purges"
          status={status}
          pending={status === "in progress"}
          cancelled={status === "pending"}
          fulfilled={kind === "onsite" && status === "pending"}
          history={false}
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

function getReturnedUserName(status, events) {
  if (!Array.isArray(events)) {
    return null
  }

  if (status !== 'fulfilled') {
    return null
  }

  const event = events.find((e) => e.en === 'Purge created');
  if (!event) {
    return null
  }

  return event.user?.name;
}
