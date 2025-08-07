import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Collapse, IconButton, Tooltip } from "@mui/material";
import { HumanDate } from "../shared/HumanDate";
import { cl, fmtDate, fmtTimestamp, getMostRecentTimestamp, getOrderBg } from "../../utils/misc";
import { Copyable } from "../shared/Copyable";
import { getHumanDate, xFetch } from "../../utils/constants";
import { StatusDisplay } from "../shared/StatusDisplay";
import { ProductsDisplay } from "../shared/ProductsDisplay";
import { getTrackedItemStatus, TrackedItems } from "../shared/TrackedItems";
import { OrderPaymentStatus } from "../shared/OrderPaymentStatus";
import { MessagesButton, SmallMessagesButton } from "../shared/MessagesButton";
import { CardDatePicker } from "../shared/CardDatePicker";
import { CostDisplay } from "../shared/CostDisplay";
import { ActionsMenu } from "../shared/ActionsMenu";
import { TargetDisplay } from "../shared/TargetDisplay";
import { useQuickEditor } from "../shared/ToolsProvider";
import { usePrintOrders } from "../shared/PrintOrders";
import { MessageStatusMenu } from "../shared/MessageStatusMenu";
import { CardSectionx } from "../shared/CardSection";
import { Card } from "../shared/Card";
import { useEffect, useState } from "react";
import { AltButton, Button } from "../shared/Button";
import { Whatsapp } from "../shared/Whatsapp";
import { useStoreState } from "easy-peasy";
import { CityCommentTooltip } from "../shared/CityCommentTooltip";
import { RatingComponent } from "../shared/Rating";

export const HorizontalOrderCard = ({
  _id,
  cost,
  target,
  products,
  status,
  desired_date,
  timestamps,
  timeline,
  messages,
  locked_items,
  payments_made,
  replacing_order,
  tracked_items,
  replacement_order,
  show_client,
  model,
}) => {
  let model_to_fetch = model === "returns" ? "purges" : model;
  const role = useStoreState((state) => state.auth.user?.role);
  const disableRating = ["followup", "warehouse"].includes(role);
  const doc = useStoreState((state) => state[model_to_fetch][model_to_fetch]?.find((doc) => doc._id === _id));
  const [isSaving, editDocument, deleteDocument] = useQuickEditor(_id, "orders");
  const [expanded, setExpanded] = useState(false);
  const [assignedWarehouse, setAssignedWarehouse] = useState();

  let displayStatus = status;

  if (["cancelled", "refused", "draft"].includes(status) && tracked_items?.length > 0) {
    const trackedStatus = getTrackedItemStatus(tracked_items[0]);
    if (trackedStatus !== "-") displayStatus = trackedStatus;
  }

  const fetchDocument = async () => {
    const { data } = await xFetch(`/warehouses/cities/${doc?.warehouse?.city}`);
    setAssignedWarehouse(data);
  };

  useEffect(() => {
    if (doc?.warehouse?.city) fetchDocument();
  }, [_id]);

  const printOrders = usePrintOrders();
  return (
    <Card backgroundColor={`${getOrderBg(timeline)}`} loading={isSaving} className="p-[10px]">
      <div className="flex justify-between gap-[5px] mb-[10px] flex-wrap">
        <div className="flex items-center gap-[15px]">
          <div className="flex text-gray-500 gap-[5px] text-sm">
            <span>&#8470;</span>
            <span className="font-semibold text-gray-700">
              <Copyable text={_id} />
            </span>
          </div>
          <StatusDisplay
            model="orders"
            status={displayStatus}
            className="bg-white/70 mx-auto"
            date={getHumanDate(getMostRecentTimestamp(timestamps), true)}
          />
        </div>
        <div className={cl("flex items-center justify-center gap-[5px]")}>
          <SmallMessagesButton _id={_id} model="orders" lastMessage={messages?.at(-1)} />
          <CardDatePicker
            date={desired_date}
            editDocument={editDocument}
            _id={_id}
            model="orders"
            disabled={isSaving || timestamps.cancelled || timestamps.fulfilled}
            isSmall
          />
          <ActionsMenu
            _id={_id}
            model="orders"
            status={status}
            role="client"
            isSmall
            editDocument={editDocument}
            deleteDocument={deleteDocument}
            pending={status === "draft"}
            edit={status === "draft"}
            draft={status === "awaiting pickup" || status === "pending" || status === "problem"}
            remove={
              status === "draft" ||
              status === "awaiting pickup" ||
              status === "pending" ||
              status === "problem" ||
              status === "cancelled"
            }
            print={status === "awaiting pickup" && locked_items ? printOrders : undefined}
            replace={status === "fulfilled" && !replacement_order}
          />
          {status === "draft" && (
            <Button
              className="h-8 animate-pulse"
              icon="motorcycle"
              onClick={() => editDocument({ status: "pending" })}
              disabled={isSaving}>
              <span className="ml-[5px]">Expédier</span>
            </Button>
          )}
        </div>
      </div>

      <div className="col-span-5 flex justify-between items-center flex-wrap gap-[5px]">
        <CardSectionx label="City" unStyled className="" hideLabel>
          <div className="flex items-center justify-start col-span-4 gap-2">
            <i className="fas fa-city"></i>
            <span className="line-clamp-2 capitalize">{target.city}</span>
            <CityCommentTooltip city={target.city} />
          </div>
        </CardSectionx>

        <CardSectionx label="Name" unStyled className="items-center" hideLabel>
          <div className="flex items-center justify-start col-span-4 gap-2">
            <i className="fas fa-user"></i>
            <span className="line-clamp-2 capitalize">{target.name}</span>
          </div>
        </CardSectionx>

        <CardSectionx label="Phone" unStyled className="items-center" hideLabel>
          <div className="flex items-center justify-start col-span-4 gap-2">
            {/* <i className="fas fa-phone-alt"></i>
            <span className="line-clamp-2 capitalize">{target.phone}</span> */}
            <Whatsapp number={target.phone} hideNumber />
          </div>
        </CardSectionx>

        <CardSectionx
          label="Produits"
          unStyled
          colSpan={products.length}
          className="items-center"
          hideLabel>
          <div className="col-span-4">
            <ProductsDisplay products={products} tracked_items={tracked_items} />
          </div>
        </CardSectionx>

        <CardSectionx label="Cost" unStyled className="items-end" hideLabel>
          <div className="flex items-center justify-start col-span-4 gap-2">
            <i className="fas fa-coins"></i>
            <span className="font-bold">{cost}</span>
            <span className="opacity-50">DH</span>
          </div>
        </CardSectionx>

        {show_client && (
          <div className="flex gap-x-[2px] col-span-4">
            <span className="text-red-600 h-6 min-w-6 px-[3px] text-sm rounded-full border border-solid flex items-center justify-center text-gray-800 border-gray-100 bg-gray-50">
              bien reçu
            </span>
          </div>
        )}

        <ToggleDetailsButton2 expanded={expanded} setExpanded={setExpanded} />
      </div>

      <Collapse in={expanded} timeout="auto" unmountOnExit className="col-span-5">
        <div className="grid grid-cols-4 gap-[0px] pt-[5px]">
          <CardSectionx label="Address" unStyled colSpan={4} className="items-center" isFlat>
            <div className="col-span-4 text-center">{target.address}</div>
          </CardSectionx>
          <CardSectionx label="Date Created" unStyled colSpan={4} className="items-center" isFlat>
            <div className="col-span-4 text-center">
              {fmtTimestamp(new Date(timestamps.created))}
            </div>
          </CardSectionx>

          <CardSectionx label="Date Modified" unStyled colSpan={4} className="items-center" isFlat>
            <div className="col-span-4 text-center">
              {fmtTimestamp(new Date(timestamps.updated))}
            </div>
          </CardSectionx>

          <CardSectionx label="Warehouse Contact No:" unStyled colSpan={4} className="items-center" isFlat>
            <div className="col-span-4 text-center">
              <Whatsapp number={assignedWarehouse?.phone} hideNumber />
            </div>
          </CardSectionx>

          {model === "orders" && (
            <RatingComponent
              type={"order"}
              _id={_id}
              model={model}
              rating={doc}
              disabled={disableRating}
            ></RatingComponent>
          )}

          {["cancelled", "refused", "draft"].includes(status) &&
            tracked_items &&
            tracked_items.length > 0 && <TrackedItems tracked_items={tracked_items} />}


          {replacing_order && (
            <div className="col-span-4 rounded-full h-10 flex items-center col-span-4 bg-white border-2 border-dashed border-blue-200 text-xl text-gray-400 cursor-default">
              <p className="text-center text-sm flex-1">
                Commande pour remplacer <span className="underline">{replacing_order._id}</span>
              </p>
            </div>
          )}

          {replacement_order && (
            <div className="col-span-4 rounded-full h-10 flex items-center col-span-4 bg-white border-2 border-dashed border-yellow-200 text-xl text-gray-400 cursor-default">
              <p className="text-center text-sm flex-1">
                Commande a été remplacée par{" "}
                <span className="underline">{replacement_order._id}</span>
              </p>
            </div>
          )}

          {status === "fulfilled" && typeof payments_made === "boolean" && (
            <OrderPaymentStatus payments_made={payments_made} />
          )}
        </div>
      </Collapse>
    </Card>
  );
};

function ToggleDetailsButton({ expanded, setExpanded }) {
  return (
    <div className="col-span-5 flex items-center justify-between">
      <div
        className={cl(
          "flex items-center justify-center gap-[3px] px-[8px] py-[8px] cursor-pointer border border-gray-300 rounded-full",
          { "bg-black/10 hover:bg-black/15 hover:shadow-sm": !expanded },
          { "bg-black/30": expanded }
        )}
        onClick={() => setExpanded(!expanded)}>
        <div className="w-[4px] h-[4px] bg-gray-600 rounded-full"></div>
        <div className="w-[4px] h-[4px] bg-gray-600 rounded-full"></div>
        <div className="w-[4px] h-[4px] bg-gray-600 rounded-full"></div>
      </div>
    </div>
  );
}

function ToggleDetailsButton2({ expanded, setExpanded }) {
  return (
    <div className="col-span-5 flex items-center justify-between">
      <div
        className={cl(
          "flex items-center justify-center h-6 cursor-pointer border-2 border-black/20 rounded-full text-sm border gap-[5px] w-[73px] select-none text-sm",
          { "bg-black/10 hover:bg-black/15 hover:shadow-sm": !expanded },
          { "bg-black/30": expanded }
        )}
        onClick={() => setExpanded(!expanded)}>
        <span>details</span>
        <i
          className={cl(
            "fas",
            { "fa-chevron-right": !expanded },
            { "fa-chevron-down": expanded }
          )}></i>
      </div>
    </div>
  );
}
