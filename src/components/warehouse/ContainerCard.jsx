import { Link } from "react-router-dom";
import { Dialog } from "@mui/material";
import { Copyable } from "../shared/Copyable";
import { MessagesButton } from "../shared/MessagesButton";
import { HumanDate } from "../shared/HumanDate";
import { Card } from "../shared/Card";
import { usePrint, useQuickEditor, useShowItem } from "../shared/ToolsProvider";
import { Pin } from "../shared/Pin";
import { ActionsMenu } from "../shared/ActionsMenu";
import { useStoreState } from "easy-peasy";
import { Button, IconButton } from "../shared/Button";
import { cl, getMostRecentTimestamp } from "../../utils/misc";
import { useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { xFetch } from "../../utils/constants";
import { useTranslation } from "../../i18n/provider";
import { AutocompleteInput, Checkbox } from "../shared/Input";
import { DownloadXls } from "../shared/DownloadXls";
import { Label } from "../shared/Label";
import { sendSystemEvent } from '../../services/systemEvents';

export const ContainerCard = ({
  _id,
  timestamps,
  from_warehouse,
  to_warehouse,
  messages,
  transfers,
  status,
  pinned,
}) => {
  const tl = useTranslation();
  const [isSaving, editDocument, deleteDocument] = useQuickEditor(_id, "containers");
  const [itemsOpen, setItemsOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const showPrint = usePrint();
  // const [itemsRefreshing, setItemsRefreshing] = useState(true);

  const warehouse_id = useStoreState((state) => state.auth.user.warehouse._id); // should fail if not warehouse;
  const isMainWarehouse = useStoreState((state) => state.auth.user.warehouse.main);
  const isSender = from_warehouse._id === warehouse_id;

  const items = transfers?.reduce((items, transfer) => {
    if (transfer.items?.length) items.push(...transfer.items);
    return items;
  }, []);

  return (
    <Card loading={isSaving}>
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-full text-sm font-light text-gray-400 hover:text-green-500 flex items-center col-span-2 -mt-1">
          <Copyable text={_id} />
        </div>
        <div className="rounded-full text-sm font-light text-gray-400 flex items-center col-span-2 justify-end -mt-1">
          <HumanDate date={getMostRecentTimestamp(timestamps)} long />
          {/* <Pin value={pinned} onChange={(pinned) => editDocument({ pinned })} /> */}
        </div>

        <TransfersDisplay
          isSender={isSender}
          from_warehouse={from_warehouse}
          to_warehouse={to_warehouse}
          transfers={transfers}
        />

        <MessagesButton messages={messages} status={status} link={`/containers/${_id}/chat`} />

        {isSender && status === "pending" && (
          <Button
            className="col-span-4" // col-span-2
            disabled={isSaving}
            icon="truck"
            label={tl("ship")}
            onClick={() => editDocument({ status: "sent" })}
          />
        )}

        <Button
          className="col-span-3"
          disabled={isSaving}
          btnColor="gray"
          icon="boxes"
          label={tl("see_items")}
          onClick={() => setItemsOpen(true)}
        />

        <div className="rounded-full h-10 text-lg flex items-center col-span-1 font-bold bg-green-50 text-green-500 border border-solid border-green-100 justify-center">
          {items.length}
        </div>

        <Button
          className="col-span-3" // col-span-2
          disabled={isSaving}
          btnColor="gray"
          icon="motorcycle"
          label={tl("see_orders")}
          onClick={() => setOrdersOpen(true)}
        />

        <ActionsMenu
          _id={_id}
          model="containers"
          editDocument={editDocument}
          deleteDocument={deleteDocument}
          status={status}
          pending={status === "sent" && isSender}
          resolved={status === "arrived" && !isSender}
          arrived={status === "sent" && isMainWarehouse}
        />
      </div>
      {/* bad  */}
      {itemsOpen && (
        <ContainerItemsDialog
          container_id={_id}
          rawItems={items}
          onClose={() => setItemsOpen(false)}
        />
      )}
      {ordersOpen && (
        <ContainerOrdersDialog
          container_id={_id}
          onClose={() => setOrdersOpen(false)}
          showPrint={showPrint}
        />
      )}
    </Card>
  );
};

function TransfersDisplay({ isSender, from_warehouse, to_warehouse, transfers }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {expanded &&
        isSender &&
        transfers.map((transfer) => (
          <Link
            key={transfer._id}
            className="rounded-full h-8 text-white bg-gray-500 flex items-center justify-center col-span-4"
            to={`/view/transfers/${transfer._id}`}>
            {transfer._id}
          </Link>
        ))}
      {isSender ? (
        <div
          className="relative rounded-full h-10 flex items-center col-span-3 bg-gray-100 text-red-500 shadow-sm justify-center capitalize cursor-pointer"
          onClick={() => setExpanded((expanded) => !expanded)}>
          {to_warehouse.city} ({to_warehouse.name})
        </div>
      ) : (
        <div
          className="relative rounded-full h-10 flex items-center col-span-3 bg-gray-100 text-green-500 shadow-sm justify-center capitalize cursor-pointer"
          onClick={() => setExpanded((expanded) => !expanded)}>
          {from_warehouse.city} ({from_warehouse.name})
        </div>
      )}
    </>
  );
}

function ContainerItemsDialog({ container_id, rawItems, onClose }) {
  const [metaData, setMetaData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const fullScreen = useMediaQuery("(max-width:768px)");
  const showItem = useShowItem();
  const showToast = useToast();

  useEffect(() => {
    fetchMetadata();
  }, []);

  async function fetchMetadata() {
    if (isLoading) return;
    setLoading(true);
    const { data, error } = await xFetch(`/containers/${container_id}/metadata`);
    setLoading(false);
    if (error) return showToast(error, "error");
    if (data) setMetaData(data);
  }
  return (
    <Dialog onClose={onClose} open={true} fullScreen={fullScreen}>
      <IconButton
        icon="times"
        onClick={onClose}
        className="absolute right-5 top-3 md:hidden z-40 text-gray-800"
        iconColor="gray"
      />
      <div className="grid grid-cols-4 gap-x-3 gap-y-3 overflow-y-scroll rounded-md bg-white text-xl p-6">
        {rawItems.map((item) => {
          const color = (() => {
            switch (metaData?.[item._id]?.status) {
              case "good":
                return "bg-green-100 hover:bg-green-200 text-green-500";
              case "error":
                return "bg-red-100 hover:bg-red-200 text-red-500";
              case "pending":
                return "bg-yellow-100 hover:bg-yellow-200 text-yellow-500";
              default:
                return "bg-gray-100 hover:bg-gray-200 text-gray-500";
            }
          })();

          return (
            <div>
              <div
                className={`rounded-full h-6 p-3 text-sm flex items-center justify-center cursor-pointer ${color}`}
                onClick={() => showItem(item._id)}
              >
                {item._id}
              </div>
              <h5 className="text-sm text-gray-500">{metaData?.[item._id]?.productName}</h5>
              <h5 className="text-sm text-gray-500">
                {metaData?.[item._id]?.clientName}
              </h5>
            </div>
          );
        })}
      </div>
      <div className="py-2 px-3 w-full flex justify-between">
        {isLoading && (
          <span className="animate-pulse text-green-600 font-semibold">Fetching metadata...</span>
        )}
      </div>
    </Dialog>
  );
}

function ContainerOrdersDialog({ container_id, onClose, showPrint }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    includePrintedOrders: true,
    includeLockedClients: true,
  });
  const fullScreen = useMediaQuery("(max-width:768px)");
  const showToast = useToast();
  const authUser = useStoreState((state) => state.auth.user);
  const canDownloadOrders = !authUser.access_restrictions.pages?.includes('download-containers-orders');
  const canPrintOrders = !authUser.access_restrictions.pages?.includes('print-containers-orders');

  async function fetchMetadata() {
    if (isLoading) return;
    setLoading(true);
    const queryParams = [];
    if (!filters.includeLockedClients) {
      queryParams.push("noLockedClients=true");
    }
    if (!filters.includePrintedOrders) {
      queryParams.push("noPrintedOrders=true");
    }
    const { data, error } = await xFetch(
      `/containers/${container_id}/orders?${queryParams.join("&")}`
    );
    setLoading(false);
    if (error) return showToast(error, "error");
    if (data) setOrders(data);
  }

  useEffect(() => {
    fetchMetadata();
  }, [filters.includeLockedClients, filters.includePrintedOrders]);

  const handleDownloadXls = async () => {
    await sendSystemEvent(authUser, {
      type: 'download_container_orders_xls',
      container: {
        _id: container_id,
        orders_count: orders.length,
        orders: orders.map(or => or.order_id)
      },
      filters: {
        includePrintedOrders: filters.includePrintedOrders,
        includeLockedClients: filters.includeLockedClients
      },
      timestamp: new Date().toISOString()
    });
  };

  const handlePrintOrders = async () => {
    await sendSystemEvent(authUser, {
      type: 'print_container_orders',
      container: {
        _id: container_id,
        orders_count: orders.length,
        orders: orders.map(or => or.order_id)
      },
      filters: {
        includePrintedOrders: filters.includePrintedOrders,
        includeLockedClients: filters.includeLockedClients
      },
      timestamp: new Date().toISOString()
    });

    showPrint(
      orders.map((or) => ({ _id: or.order_id, items: or.items })),
      { isOrders: true, isContainer: true }
    );
    onClose();
  }

  return (
    <Dialog onClose={onClose} open={true} fullScreen={fullScreen}>
      <IconButton
        icon="times"
        onClick={onClose}
        className="absolute right-5 top-3 md:hidden z-40 text-gray-800"
        iconColor="gray"
      />
      <div className="grid grid-cols-4 gap-x-3 gap-y-3 overflow-y-scroll rounded-md bg-white text-xl p-6">
        {orders.map((or) => (
          <div
            key={or.order_id}
            className={`rounded-full h-6 p-3 text-sm flex items-center justify-center cursor-default bg-gray-200 text-gray-500`}>
            {or.order_id}
          </div>
        ))}
      </div>
      <div className="py-2 px-3 w-full flex gap-x-[10px] justify-end">
        <div className="flex-1 flex flex-col gap-[2px]">
          <div className="flex items-center gap-[5px]">
            <Label text="Include printed orders" className="text-sm" />
            <Checkbox
              checked={filters.includePrintedOrders}
              onValueChange={() =>
                setFilters({ ...filters, includePrintedOrders: !filters.includePrintedOrders })
              }
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center gap-[5px]">
            <Label text="Include locked clients" className="text-sm" />
            <Checkbox
              checked={filters.includeLockedClients}
              onValueChange={() =>
                setFilters({ ...filters, includeLockedClients: !filters.includeLockedClients })
              }
              disabled={isLoading}
            />
          </div>
        </div>
        {orders.length > 0 && (
          <>
            {canDownloadOrders && <DownloadXls
              model="orders"
              filter={{ ids: orders.map((or) => or.order_id) }}
              disabled={isLoading}
              onClick={handleDownloadXls}
            />}
            {canPrintOrders && <IconButton
              icon="print"
              iconColor="red"
              disabled={isLoading}
              onClick={handlePrintOrders}
            />}
          </>
        )}
        {orders.length === 0 && !isLoading && <span>No Orders</span>}
      </div>
      <div className="py-2 px-3 w-full flex justify-between">
        {isLoading && (
          <span className="animate-pulse text-green-600 font-semibold">Fetching metadata...</span>
        )}
      </div>
    </Dialog>
  );
}
