import { ActionsMenu } from "../shared/ActionsMenu";
import { Copyable } from "../shared/Copyable";
import { ClientDisplay } from "../shared/ClientDisplay";
import { ProductsDisplay } from "../shared/ProductsDisplay";
import { MessagesButton } from "../shared/MessagesButton";
import { HumanDate } from "../shared/HumanDate";
import { Button } from "../shared/Button";
import { Card } from "../shared/Card";
import { useQuickEditor, useSeeItems } from "../shared/ToolsProvider";
import { Pin } from "../shared/Pin";
import { getMostRecentTimestamp } from "../../utils/misc";
import { useStoreState } from "easy-peasy";
import { useTranslation } from "../../i18n/provider";
import { Tags } from "../shared/Tags";

export const TransferCard = ({
  _id,
  timestamps,
  products,
  to_city,
  to_warehouse,
  messages,
  status,
  pinned,
  client,
  items,
  tags,
}) => {
  const tl = useTranslation();
  const [isSaving, editDocument, deleteDocument] = useQuickEditor(_id, "transfers");
  const cities = useStoreState((state) => state.cities.cities);
  const mainCity = cities.find((city) => city.name === to_city)?.mainCity;

  const seeItems = useSeeItems({ items, products });

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

        <ClientDisplay client={client} />

        <ProductsDisplay products={products} showRefrs />

        <div className="rounded-full h-10 flex items-center col-span-3 bg-gray-100 text-red-500 shadow-sm justify-center capitalize">
          {to_warehouse?.city || mainCity} {to_warehouse && <>({to_warehouse.name})</>}
        </div>

        <MessagesButton messages={messages} status={status} link={`/transfers/${_id}/chat`} />

        {status === "pending" && (
          <Button
            className="col-span-3"
            label={tl("add_to_container")}
            btnColor={"green"}
            icon={"box-open"}
            onClick={() =>
              editDocument({ status: "in progress" }, "items", undefined, {
                title: `Transfer Items`,
                products,
                city: mainCity || to_city,
                hint: { transfer_id: _id },
                client,
              })
            }
          />
        )}
        {["in progress", "fulfilled"].includes(status) && (
          <Button
            className="col-span-3"
            label={tl("see_items")}
            btnColor={"gray"}
            icon={"boxes"}
            onClick={seeItems}
          />
        )}
        <ActionsMenu
          _id={_id}
          model="transfers"
          editDocument={editDocument}
          deleteDocument={deleteDocument}
          status={status}
          cancelled={status === "pending"}
          pending={status === "in progress"}
        />
      </div>
    </Card>
  );
};
