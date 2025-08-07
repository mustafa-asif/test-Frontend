import { Fragment, useState, useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { useUpdates } from "../../hooks/useUpdates";
import { useStoreState, useStoreActions } from "easy-peasy";
import { NoSearchResults } from "./NoSearchResults";
import { CircularProgress, Tab, Tabs } from "@mui/material";
import { useTypeCallback } from "../../hooks/useTypeCallback";
import useFirstVisit from "../../hooks/useFirstVisit";
import useNextEffects from "../../hooks/useNextEffects";
import { useScrollHandler } from "./ScrollContainer";
import { xFetch } from "../../utils/constants";
import { RefreshButton } from "./RefreshButton";
import { StatusCombobox } from "./StatusCombobox";
import { NothingCard } from "./NothingCard";
import { IconInput } from "./Input";
import { getDepsFromObjs, globalFilterToQuery, cl, getTomorrow } from "../../utils/misc";
import { useScan, useShowItem, useViewStyle } from "./ToolsProvider";
import { DateFilter, NewDateFilter } from "./DateFilter";
import { usePersistantFilters } from "./FiltersProvider";
import { useTranslation } from "../../i18n/provider";
import { IconButton } from "./Button";
import { DelivererCombobox } from "../warehouse/DelivererCombobox";
import { WarehouseCombobox } from "../followup/WarehouseCombobox";
import { TagsCombobox } from "../shared/TagsCombobox";
import { DirectionFilter } from "../warehouse/DirectionFilter";
import { SortFilter } from "./SortFilter";
import { getDatePlusDays, getToday } from "../../utils/misc";
import { DownloadXls } from "./DownloadXls";
import { ColorBanner } from "./ColorBanner";
import { ActionFilter } from "./ActionFilter";
import { ThumbsFilter } from "./ThumbsFilter";
import { RatingFilter } from "./RatingFilter";
import { SupportCategoryFilter } from "./SupportCategoryFilter";
import { ProductsFilter } from "../warehouse/ProductsFilter";
import { OrderIssuesFilter } from "../followup/OrderIssuesFilter";
import { NeedToReturnFilter } from "./NeedToReturnFilter";
import { DateTypeFilter } from "./DateTypeFilter";
import { ViewStylePicker } from "./ViewStylePicker";
import { BulkPayCyclesBtn } from "../payman/BulkPayCyclesBtn";
import { TotalDisplay } from "../payman/TotalDisplay";
import { OrdersDocumentTab } from "./OrdersDocumentTabs";
import { QuickTagFilter } from "./QuickTagFilter";
import { ExportSelected } from "./ExportSelected";
import TotalDisplayWarehouse from "../warehouse/TotalDisplayWarehouse";
import { TransferTypeFilter } from "../warehouse/TransferTypeFilter";
import { WarehouseUsersFilter } from "../warehouse/WarehouseUsersFilter";
import { InventoryScanFilter } from "../warehouse/InventoryScanFilter";

export const DocumentsManager = ({
  model,
  initialFilters = {},
  processDocuments = (docs) => docs,
  DocumentCard,
  HorizontalCard,
  LoadingCard,
  DocumentsTable,
  customApi = undefined,
  customRoute = undefined,
  increments = 24,
  children,
  refreshOnVisit = false,
  initialSort,
  noRealtime = false,
  sortOptions = [],
  downloadXls = false,
  exportSelected = false,
}) => {
  const [persistantFilters, setPersistantFilters] = usePersistantFilters(model);
  initialFilters = { ...initialFilters, ...persistantFilters };
  const user = useStoreState((state) => state.auth.user);
  const showToast = useToast();
  const showItem = useShowItem();
  const history = useHistory();
  const promptScan = useScan({ onData: handleScan, fetchDocument: false });
  const showInventoryScan = useScan({
    onData: handleInventoryScan,
    fetchDocument: true,
    model,
    autoClose: false
  });
  const startListeningWS = useUpdates(model);
  const viewStyle = useViewStyle().viewStyle;

  const [loadingMore, setLoadingMore] = useState(false);
  const [cancelFunc, setCancelFunc] = useState(null);
  const [filter, setActualFilter] = useState(initialFilters);
  const [sort, setSort] = useState(initialSort);

  function setFilter(func_or_value, dont_persist = false) {
    setActualFilter((filter) => {
      const updated = typeof func_or_value === "function" ? func_or_value(filter) : func_or_value;
      if (!dont_persist) setPersistantFilters?.(updated);
      return updated;
    });
  }

  const { loading, [model]: documents } = useStoreState((state) => state[model]);

  const addDocuments = useStoreActions(
    (actions) => actions[model][`add${model[0].toUpperCase() + model.slice(1)}`]
  );
  const setDocuments = useStoreActions(
    (actions) => actions[model][`set${model[0].toUpperCase() + model.slice(1)}`]
  );

  const selected_ids = useStoreState((state) => state[model]?.selected_ids?.map(({ _id }) => _id) ?? [])


  const { setInputValue, ...searchInputProps } = useTypeCallback(
    handleSearchAccept,
    handleTyping,
    undefined,
    filter.keyword
  );

  function handleScan(value) {
    if (value.startsWith("it") && [8, 10, 12].includes(value.length)) {
      return showItem(value);
    } else {
      setFilter((filter) => ({ ...filter, keyword: value }), true);
    }
  }

  async function handleInventoryScan(item) {
    if (!item?._id) {
      setFilter((filter) => ({ ...filter, keyword: item }), true);
      return;
    }

    const { error } = await xFetch(`/items/${item._id}`, {
      method: "PATCH",
      body: {
        last_inventory_scan: {
          timestamp: new Date().toISOString(),
          user: {
            _id: user._id,
            name: user.name
          }
        }
      },
    });

    if (error) {
      showToast(error, "error");
      return;
    }

    showToast("Item inventory updated successfully", "success");
    fetchMoreDocuments({ clearFilters: false, storeLevel: true });
  }

  function handleTyping(val) {
    console.log("typing");
    cancelFunc?.();
    if (val.startsWith("it") && [8, 10, 12].includes(val.length)) {
      setFilter({ ...filter, keyword: "" }, true);
      setDocuments({ loading: false });
      setInputValue("");
      return showItem(val);
    }
    if (loading) return;
    setDocuments({ loading: true, [model]: [] });
  }

  function handleSearchAccept(keyword) {
    setFilter((filter) => ({ ...filter, keyword }));
  }

  function handleStatusChange(status) {
    setFilter({ ...filter, status });
    if (status === "returned-pending" && user.role === "warehouse" && model === "orders") {
      setSort("timestamps.updated");
    }
  }

  function fetchMoreDocuments({ clearFilters = false, storeLevel = false }) {
    const promise = async function (signal) {
      console.log("fetching more documents");
      cancelFunc?.();

      if (storeLevel) setDocuments({ loading: true, [model]: [] });
      else setLoadingMore(true);

      const skip = storeLevel
        ? 0
        : model === "products" && ["deliverer", "warehouse"].includes(user.role)
          ? processDocuments(documents).length // if number of cards shown does not represent actual number of documents due to processing
          : documents.length;
      const limit = increments;
      const rest = globalFilterToQuery(filter);

      if (sort) rest.push(`_sort=${sort}`);

      const { data, error, aborted } = await xFetch(
        `/${customRoute?.replace(/^\//, "") || model}`,
        { signal },
        false,
        customApi,
        [`_skip=${skip}`, `_limit=${limit}`, ...rest]
      );

      if (aborted) return;
      setCancelFunc(null);

      if (data?.length < 1 && filter.status && filter.status !== "all" && clearFilters) {
        setFilter((filter) => ({
          ...filter,
          keyword: typeof initialFilters.keyword === "undefined" ? undefined : "",
          date: typeof initialFilters.date === "undefined" ? undefined : "all time",
          status: "all",
          deliverer: typeof initialFilters.deliverer === "undefined" ? undefined : "all",
          warehouse: typeof initialFilters.warehouse === "undefined" ? undefined : "all",
        }));
        return;
      }

      if (storeLevel) setDocuments({ loading: false });
      else setLoadingMore(false);

      if (error) return showToast(error, "error");
      if (data?.length > 0) addDocuments(data);
    };

    const controller = new AbortController();
    const cancel = () => {
      controller.abort();
      console.log("request cancelled");
      setCancelFunc(null);
    };

    promise(controller.signal);
    setCancelFunc(() => cancel);
  }

  useNextEffects(
    function () {
      console.log("exec from filter");
      fetchMoreDocuments({ storeLevel: true });
    },
    model,
    [...getDepsFromObjs(filter), sort] // temporary
  );

  useFirstVisit(function () {
    console.log("exec from init");
    fetchMoreDocuments({ clearFilters: true, storeLevel: true });
    if (!noRealtime) startListeningWS();
  }, model);

  useScrollHandler(
    useCallback(() => {
      console.log("exec from scroll");
      fetchMoreDocuments({});
    }, [filter, cancelFunc, documents.length, sort])
  );

  const tl = useTranslation();

  function filterDocuments(document) {
    if (!["orders", "pickups", "transfers", "containers"].includes(model)) return true;
    if (
      !filter.status ||
      filter.status === "all" ||
      filter.status === "pinned" ||
      filter.status === "deleted" ||
      filter.status === "postponed" ||
      filter.status === "returned-fully" ||
      filter.status === "returned-warehouse" ||
      filter.status === "returned-started" ||
      filter.status === "returned-pending"
    )
      return true;

    return document.status === filter.status;
  }

  return (
    <Fragment>
      <div
        className={cl("pb-10 relative", {
          "pb-3": user.role === "warehouse" && ["orders"].includes(model),
        })}>
        <div className="lg:flex lg:flex-row lg:flex-wrap flex flex-col gap-3 w-full px-4 md:px-10">
          {children}
          {user.role === "payman" &&
            ["clientCycles", "warehouseCycles"].includes(model) &&
            ((model === "clientCycles" && filter.status === "active-ready") ||
              (model === "warehouseCycles" && filter.status === "sent")) && (
              <BulkPayCyclesBtn model={model} />
            )}

          {user.role === "payman" &&
            ["clientCycles", "warehouseCycles"].includes(model) &&
            ["paid", "paid-unjustified", "paid-justified"].includes(filter.status) &&
            filter.from_date &&
            filter.to_date && <TotalDisplay model={model} filter={filter} loading={loadingMore} />}

          <RefreshButton
            customApi={customApi}
            model={model}
            filter={filter}
            isLoading={loadingMore}
            sort={sort}
            refreshOnMount={refreshOnVisit}
          />
          {downloadXls && !["warehouse", "followup"].includes(user.role) && (
            <DownloadXls customApi={customApi} model={model} filter={filter} sort={sort} />
          )}
          {exportSelected && selected_ids.length > 0 && (
            <ExportSelected ids={selected_ids} model={model} />
          )}
          {user.role === "client" && ["orders"].includes(model) && <ViewStylePicker />}
          <div
            onClick={() => {
              console.log("Filter");
              document.querySelector(".filters-container").classList.toggle("active");
            }}
            style={{
              height: 45,
              boxShadow:
                "0px 0px 30px rgba(16, 185, 129, 0.2), inset 0 -10px 15px 0 rgba(16, 185, 129, 0.4)",
            }}
            className="bg-white px-4 hover:bg-gray-200 hover:text-gray-900 hover:shadow-xl transition duration-300 rounded-xl z-10 text-lg font-bold uppercase flex items-center justify-center h-12 cursor-pointer">
            <i className={`fas fa-filter text-orange-400 pr-2`}></i>
            Filters
          </div>
          {user.role === "warehouse" && model === "products" && (
            <div
              onClick={showInventoryScan}
              style={{
                height: 45,
                boxShadow:
                  "0px 0px 30px rgba(16, 185, 129, 0.2), inset 0 -10px 15px 0 rgba(16, 185, 129, 0.4)",
              }}
              className="bg-white px-4 hover:bg-gray-200 hover:text-gray-900 hover:shadow-xl transition duration-300 rounded-xl z-10 text-lg font-bold uppercase flex items-center justify-center h-12 cursor-pointer">
              <i className={`fas fa-barcode text-blue-400 pr-2`}></i>
              Inventory
            </div>
          )}
          {(user?.role === "warehouse" && model === "deliverers") && (
            <TotalDisplayWarehouse model={model} filter={filter} loading={loadingMore} />
          )}
        </div>
        <div className="filters-container pt-4 lg:grid flex flex-col gap-3 w-full px-4 md:px-10">
          {typeof initialFilters.keyword !== "undefined" && (
            <IconInput
              {...searchInputProps}
              className="font-bold"
              icon="search"
              placeholder={tl("search")}>
              {user.role === "warehouse" && (
                <button
                  onClick={promptScan}
                  className="absolute right-1 bg-gray-600 hover:bg-gray-400 flex items-center justify-center"
                  style={{ height: 38, width: 38, borderRadius: 19 }}>
                  <i className={`fas fa-qrcode text-gray-100 text-xl`}></i>
                </button>
              )}
            </IconInput>
          )}
          {typeof initialFilters.date !== "undefined" && (
            <DateFilter
              value={filter.date}
              onValueChange={(date) => {
                setFilter({ ...filter, date });
              }}
            />
          )}
          {initialFilters.status && (
            <StatusCombobox
              value={filter.status}
              filter={filter}
              onValueChange={(status) => {
                setFilter({
                  ...filter,
                  status,
                  deliverer: typeof initialFilters.deliverer !== "undefined" ? "all" : undefined,
                  warehouse: typeof initialFilters.warehouse !== "undefined" ? "all" : undefined,
                });
              }}
              model={model}
            />
          )}

          {typeof initialFilters.deliverer !== "undefined" && (
            <DelivererCombobox
              model={model}
              value={filter.deliverer}
              filter={filter}
              onValueChange={(deliverer) => {
                setFilter({ ...filter, deliverer });
              }}
            />
          )}

          {initialFilters.deliverer_status && (
            <StatusCombobox
              value={filter.deliverer_status}
              filter={filter}
              onValueChange={(status) => {
                setFilter({
                  ...filter,
                  deliverer_status: status,
                });
              }}
              model={model}
            />
          )}
          {typeof initialFilters.warehouse !== "undefined" && (
            <WarehouseCombobox
              model={model}
              value={filter.warehouse}
              filter={filter}
              onValueChange={(warehouse) => {
                setFilter({ ...filter, warehouse });
              }}
            />
          )}
          {typeof initialFilters.direction !== "undefined" &&
            model === "containers" &&
            user.role === "warehouse" && (
              <DirectionFilter
                value={filter.direction}
                onValueChange={(direction) => setFilter({ ...filter, direction })}
              />
            )}
          {user.role === "warehouse" && model === "transfers" && (
            <TransferTypeFilter
              model={model}
              value={filter.transferType || "all"}
              filter={filter}
              onValueChange={(transferType) => setFilter({ ...filter, transferType })}
            />
          )}
          {(user.role === "warehouse" || user.role === "followup") && (
            <>
              {typeof initialFilters.action !== "undefined" && (
                <ActionFilter
                  model={model}
                  value={filter.action}
                  filter={filter}
                  onValueChange={(action) => setFilter({ ...filter, action })}
                />
              )}
              {typeof initialFilters.thumbs !== "undefined" && (
                <ThumbsFilter
                  model={model}
                  value={filter.thumbs}
                  filter={filter}
                  onValueChange={(thumbs) => setFilter({ ...filter, thumbs })}
                />
              )}
              {model === "orders" && (
                <RatingFilter
                  model={model}
                  type={"orderRating"}
                  icon={"fa-box"}
                  value={filter.orderRating}
                  filter={filter}
                  onValueChange={(orderRating) => setFilter({ ...filter, orderRating })}
                />
              )}
              {model === "pickups" && (
                <RatingFilter
                  model={model}
                  type={"pickupRating"}
                  icon={"fa-box"}
                  value={filter.pickupRating}
                  filter={filter}
                  onValueChange={(pickupRating) => setFilter({ ...filter, pickupRating })}
                />
              )}

              {typeof initialFilters.supportRating !== "undefined" && (
                <RatingFilter
                  model={model}
                  type={"supportRating"}
                  icon={"fa-hands-helping"}
                  value={filter.supportRating}
                  filter={filter}
                  onValueChange={(supportRating) => setFilter({ ...filter, supportRating })}
                />
              )}
            </>
          )}

          {user.role === "followup" && (
            <>
              {typeof initialFilters.supportCategory !== "undefined" && (
                <>
                  <SupportCategoryFilter
                    model={model}
                    icon={"fa-ticket-alt"}
                    value={filter.supportCategory}
                    filter={filter}
                    onValueChange={(supportCategory) =>
                      setFilter({ ...filter, supportCategory, supportSubCategory: "all" })
                    }
                  />
                  {filter.supportCategory !== "all" && (
                    <SupportCategoryFilter
                      model={model}
                      icon={"fa-ticket-alt"}
                      supportCategory={filter.supportCategory}
                      value={filter.supportSubCategory}
                      filter={filter}
                      onValueChange={(supportSubCategory) =>
                        setFilter({ ...filter, supportSubCategory })
                      }
                    />
                  )}
                </>
              )}
              {model === "orders" && (
                <OrderIssuesFilter
                  model={model}
                  type={"orderIssues"}
                  icon={"fa-box"}
                  value={filter.orderIssue}
                  filter={filter}
                  onValueChange={(orderIssue) =>
                    setFilter((filter) => {
                      switch (orderIssue) {
                        case "awaiting-pickup-order":
                          filter.status = "awaiting pickup";
                          break;
                        case "transfer-order":
                          filter.status = "awaiting transfer";
                          break;
                        case "draft-order":
                          filter.status = "draft";
                          break;
                      }
                      return {
                        ...filter,
                        status:
                          orderIssue == "awaiting-pickup-order" ? "awaiting pickup" : filter.status,
                        orderIssue,
                      };
                    })
                  }
                />
              )}
            </>
          )}

          {typeof initialFilters.tags !== "undefined" && (
            <TagsCombobox
              model={model}
              value={filter.tags}
              filter={filter}
              onValueChange={(tags) => {
                setFilter({ ...filter, tags });
              }}
            />
          )}

          {typeof initialFilters.needToReturn !== "undefined" &&
            !user.warehouse.main &&
            user.warehouse.options.lock_items && (
              <NeedToReturnFilter
                model={model}
                value={filter.needToReturn}
                filter={filter}
                onValueChange={(needToReturn) => {
                  setFilter({ ...filter, status: "all", needToReturn });
                }}
              />
            )}

          {typeof initialFilters.productStatus !== "undefined" && (
            <ProductsFilter
              model={model}
              value={filter.productStatus}
              filter={filter}
              onValueChange={(productStatus) => {
                setFilter({ ...filter, productStatus });
              }}
            />
          )}

          {user.role === "warehouse" && model === "products" && (
            <WarehouseUsersFilter
              model={model}
              value={filter.warehouseUser || "all"}
              filter={filter}
              onValueChange={(warehouseUser) => {
                console.log('> adding warehouse user to filter', warehouseUser)
                setFilter({ ...filter, warehouseUser });
              }}
            />
          )}

          {user.role === "warehouse" && model === "products" && (
            <InventoryScanFilter
              model={model}
              value={filter.inventoryScan || "all"}
              onValueChange={(inventoryScan) => {
                setFilter({ ...filter, inventoryScan });
              }}
            />
          )}

          <div className="col-span-4 relative flex flex-start justify-start flex-wrap gap-3">
            {/* {typeof initialFilters.date_type !== "undefined" && ( */}
            {model === "orders" && (
              <DateTypeFilter
                model={model}
                value={filter.dateType ?? "updated"}
                user={user}
                filter={filter}
                onValueChange={(dateType) => {
                  setFilter({ ...filter, dateType });
                }}
              />
            )}

            {/* )} */}
            {typeof initialFilters.from_date !== "undefined" && (
              <NewDateFilter
                label="From"
                value={filter.from_date}
                onValueChange={(from_date) => setFilter({ ...filter, from_date })}
                maxDate={filter.to ? getDatePlusDays(new Date(filter.to), -1) : getToday()}
              />
            )}
            {typeof initialFilters.to_date !== "undefined" && (
              <NewDateFilter
                label="To"
                value={filter.to_date}
                onValueChange={(to_date) => setFilter({ ...filter, to_date })}
                minDate={filter.from_date ? getDatePlusDays(new Date(filter.from_date), 1) : null}
                maxDate={getTomorrow()}
              />
            )}
            {initialSort && (
              <SortFilter
                value={sort}
                onValueChange={(sort) => setSort(sort)}
                options={sortOptions}
                translate={model === "orders" && user.role === "client"}
              />
            )}
          </div>
        </div>

        <ColorBanner />
      </div>
      {user.role === "warehouse" && ["orders"].includes(model) && (
        <div className="flex px-4 pb-10 md:px-10 gap-3 items-center">
          <OrdersDocumentTab
            currentStatus={filter.status}
            setCurrentStatus={handleStatusChange}
          />
          <QuickTagFilter
            tag={filter.tags}
            setTag={(tags) => {
              setFilter({ ...filter, tags });
            }}
          />
        </div>
      )}
      <div
        className={cl("px-4 md:px-10 relative ", {
          "flex-1 flex flex-col": viewStyle === "table",
        })}>
        {(viewStyle === "card" || !HorizontalCard) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 w-full pb-6 overflow-hidden">
            {processDocuments(documents, user)
              .filter(filterDocuments)
              .map((doc) => (
                <DocumentCard key={doc._id} {...doc} />
              ))}
            {loading && [...Array(4)].map((e, i) => <LoadingCard key={i} />)}
            {!loading && documents.length < 1 && (
              <NothingCard>
                <NoSearchResults model={model} filter={filter} setFilter={setFilter} />
              </NothingCard>
            )}
          </div>
        )}
        {viewStyle === "vertical" && HorizontalCard && (
          <div className="grid grid-cols-1 gap-4 w-full pb-6 px-2 overflow-hidden">
            {processDocuments(documents, user)
              .filter(filterDocuments)
              .map((doc) => (
                <HorizontalCard key={doc._id} {...doc} model={model} />
              ))}
            {loading && [...Array(4)].map((e, i) => <LoadingCard key={i} />)}
            {!loading && documents.length < 1 && (
              <NothingCard>
                <NoSearchResults model={model} filter={filter} setFilter={setFilter} />
              </NothingCard>
            )}
          </div>
        )}
        {loadingMore && (
          <div className="absolute left-0 right-0 w-max m-auto">
            <CircularProgress style={{ color: "#FBBF24" }} />
          </div>
        )}
        {!loadingMore && documents.length >= increments && (
          <div className="absolute left-0 right-0 w-max m-auto">
            <IconButton icon="arrow-down" iconColor="blue" onClick={() => fetchMoreDocuments({})} />
          </div>
        )}
      </div>
    </Fragment>
  );
};
