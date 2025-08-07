import { useStoreActions, useStoreState } from "easy-peasy";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "../../i18n/provider";
import { STATS_URL, xFetch } from "../../utils/constants";
import { getBgColor } from "../../utils/misc";
import { StatBoxSkeleton } from "../skeletons/StatBoxSkeleton";
import { BarChart } from "./BarChart";
import { NewDateFilter } from "./DateFilter";
import { usePersistantFilters } from "./FiltersProvider";
import { PieChart } from "./PieChart";
import { CrudeRefreshButton } from "./RefreshButton";
import { StatBox } from "./StatBox";
import { useToast } from "../../hooks/useToast";
import { LineChart } from "./LineChart";
import { ClientsCombobox } from "./ClientsCombobox";
import { WarehousesCombobox } from "./WarehousesCombobox";
import { UserSelect } from "./UserSelect";
import { ColorBanner } from "./ColorBanner";

export const StatsDashboard = ({ schema, initialFilters = {} }) => {
  const [persistantFilters, setPersistantFilters] = usePersistantFilters("dashboard");
  initialFilters = { ...initialFilters, ...persistantFilters };

  const [filter, setActualFilter] = useState(initialFilters);
  const [suggestRefresh, setSuggestRefresh] = useState(false);

  function setFilter(func_or_value, dont_persist = false) {
    setActualFilter((filter) => {
      const updated = typeof func_or_value === "function" ? func_or_value(filter) : func_or_value;
      if (!dont_persist) setPersistantFilters?.(updated);
      return updated;
    });
    setSuggestRefresh(true);
  }

  const showToast = useToast();
  const tl = useTranslation();

  const user = useStoreState((state) => state.auth.user);
  const { loading, stats } = useStoreState((state) => state.dashboard);
  const setDashboard = useStoreActions((actions) => actions.dashboard.setDashboard);

  async function updateDashboardStats(e, freshOnly = false) {
    setSuggestRefresh(false);
    setDashboard({ loading: true, stats: {} });

    const query = ["previous=true"];

    if (freshOnly) query.push("fresh=true");
    if (filter.from_date) query.push(`start_date=${filter.from_date.getTime()}`);
    if (filter.to_date) query.push(`end_date=${filter.to_date.getTime()}`);
    if (filter.client_id) query.push(`client_id=${filter.client_id}`);
    if (filter.warehouse_id) query.push(`warehouse_id=${filter.warehouse_id}`);
    if (filter.deliverer_id) query.push(`deliverer_id=${filter.deliverer_id}`);

    const { data, error } = await xFetch(
      `/statistics/dashboard`,
      undefined,
      undefined,
      STATS_URL,
      query
    );

    if (error) {
      setDashboard({ loading: false });
      console.log(error);
      return showToast("Failed to load statistics", "error");
    }
    if (data) setDashboard({ stats: data, loading: false });
  }

  useEffect(() => {
    if (loading) updateDashboardStats(null, false);
  }, []);

  return (
    <Fragment>
      <div className="relative pb-32" style={{ marginTop: -65, paddingTop: 75 }}>
        <div className="px-4 md:px-10 mx-auto w-full">
          <div className="w-full flex flex-wrap items-center gap-x-3 gap-y-3 mb-5">
            {typeof initialFilters.from_date !== "undefined" && (
              <NewDateFilter
                label="From"
                value={filter.from_date}
                onValueChange={(from_date) => setFilter({ ...filter, from_date })}
                disabled={loading}
              />
            )}
            {typeof initialFilters.to_date !== "undefined" && (
              <NewDateFilter
                label="To"
                value={filter.to_date}
                onValueChange={(to_date) => setFilter({ ...filter, to_date })}
                disabled={loading}
              />
            )}
            {typeof initialFilters.client_id !== "undefined" && (
              <ClientsCombobox
                value={filter.client_id}
                onValueChange={(client_id) => setFilter((filter) => ({ ...filter, client_id }))}
                disabled={loading}
                inputProps={{ placeholder: "All Clients" }}
              />
            )}
            {typeof initialFilters.warehouse_id !== "undefined" && (
              <WarehousesCombobox
                value={filter.warehouse_id}
                onValueChange={(warehouse_id) =>
                  setFilter((filter) => ({ ...filter, warehouse_id }))
                }
                disabled={loading}
                inputProps={{ placeholder: "All Warehouses" }}
              />
            )}
            {typeof initialFilters.deliverer_id !== "undefined" && (
              // get rid of "none" option
              <UserSelect
                filters={["role=deliverer", "active=true"]}
                value={filter.deliverer_id}
                onValueChange={(deliverer_id) =>
                  setFilter((filter) => ({ ...filter, deliverer_id }))
                }
                disabled={loading}
                inputProps={{ placeholder: "All Deliverers" }}
              />
            )}
            <CrudeRefreshButton
              isLoading={loading}
              onClick={() => updateDashboardStats(null, true)}
              isSuggested={suggestRefresh}
            />
          </div>
          <div className="columns-1-2 gap-x-3 gap-y-3">
            {loading
              ? schema.map((object, i) =>
                  object.type === "statbox" ? (
                    <StatBoxSkeleton className="mb-3" key={i} />
                  ) : (
                    <StatBoxSkeleton className="mb-3" key={i} />
                  )
                )
              : schema.map(
                  (
                    { type, props, valueFormatter, getLabels, getDatasets, antiFilters = [] },
                    i
                  ) => {
                    for (const filterKey of Object.keys(filter)) {
                      if (!filter[filterKey]) continue;
                      if (!antiFilters.includes(filterKey)) continue;
                      return null;
                    }
                    switch (type) {
                      case "statbox":
                        return (
                          <StatBox
                            title={tl(props.title)}
                            value={valueFormatter(
                              props.valuePaths.reduce((value, path) => value[path], stats)
                            )}
                            unit={tl(props.unit)}
                            icon={props.icon}
                            iconColor={props.iconColor}
                            className="mb-3"
                            key={i}
                          />
                        );
                      case "piechart":
                        return (
                          <PieChart
                            title={tl(props.title)}
                            labels={getLabels(
                              props.valuePaths.reduce((value, path) => value[path], stats)
                            )}
                            datasets={getDatasets(
                              props.valuePaths.reduce((value, path) => value[path], stats)
                            )}
                            className="mb-3"
                            key={i}
                          />
                        );
                      case "barchart":
                        return (
                          <BarChart
                            title={tl(props.title)}
                            labels={getLabels(
                              props.valuePaths.reduce((value, path) => value[path], stats)
                            )}
                            datasets={getDatasets(
                              props.valuePaths.reduce((value, path) => value[path], stats)
                            )}
                            className="mb-3"
                            horizontal={props.horizontal}
                            options={props.options}
                            key={i}
                          />
                        );
                      case "linechart":
                        return (
                          //
                          <LineChart
                            title={tl(props.title)}
                            labels={getLabels(
                              props.valuePaths.reduce((value, path) => value[path], stats)
                            )}
                            datasets={getDatasets(
                              props.valuePaths.reduce((value, path) => value[path], stats)
                            )}
                            className="mb-3"
                            key={i}
                          />
                        );
                      default:
                        return <p>unknown object {type}</p>;
                    }
                  }
                )}
          </div>
        </div>
        <ColorBanner className={"top-0 bottom-0"} style={{ bottom: 0 }} />
      </div>
    </Fragment>
  );
};
