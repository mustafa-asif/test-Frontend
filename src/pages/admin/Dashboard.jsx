import { useStoreActions, useStoreState } from "easy-peasy";
import { Fragment, useState, useEffect } from "react";
import { StatBox } from "../../components/shared/StatBox";
import { StatBoxSkeleton } from "../../components/skeletons/StatBoxSkeleton";
import { getDatePlusDays, getToday, xGetDashboard } from "../../utils/misc";
import { NewDateFilter } from "../../components/shared/DateFilter";
import { getDepsFromObjs } from "../../utils/misc";
import { Link } from "react-router-dom";
import { OrdersReportCard } from "../../components/admin/OrdersReportCard";
import { useTranslation } from "../../i18n/provider";

export default function DashboardPage() {
  const [filter, setFilter] = useState({ from: "", to: "" });

  const setDashboard = useStoreActions(actions => actions.dashboard.setDashboard);
  const { loading, stats } = useStoreState(state => state.dashboard);
  const tl = useTranslation();

  async function refreshDashboard() {
    console.log("refreshing dashboard");
    setDashboard({ loading: true });
    const { data, error } = await xGetDashboard(filter);
    setDashboard({ stats: data, loading: false });
  }

  useEffect(() => {
    refreshDashboard();
  }, [...getDepsFromObjs(filter)]); // temporary

  return (
    <Fragment>
      <div className="relative pb-32" style={{ marginTop: -65, paddingTop: 75 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 w-full px-4 md:px-10 mb-5"></div>
        <div className="px-4 md:px-10 mx-auto w-full">
          <div>
            <div className="flex flex-wrap gap-y-3">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <div className="w-full lg:w-6/12 xl:w-3/12 px-4" key={i}>
                    <StatBoxSkeleton />
                  </div>
                ))
              ) : (
                <>
                  <div className="z-40 w-full flex items-center gap-x-3 mb-5 md:w-auto md:absolute md:right-28 md:top-3.5">
                    {/* <p className="text-gray-800 font-bold ml-4 mr-2">From:</p> */}
                    <NewDateFilter
                      label="From"
                      value={filter.from}
                      onValueChange={from => setFilter({ ...filter, from })}
                      maxDate={filter.to ? getDatePlusDays(new Date(filter.to), -1) : getToday()}
                    />
                    <p className="text-gray-800 font-bold">-</p>
                    <NewDateFilter
                      label="To"
                      value={filter.to}
                      onValueChange={to => setFilter({ ...filter, to })}
                      minDate={filter.from ? getDatePlusDays(new Date(filter.from), 1) : null}
                      maxDate={getToday()}
                    />
                  </div>
                  <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                    <StatBox
                      title={"invoices IN (+)"}
                      value={stats?.invoices_gain?.in}
                      unit={"MAD"}
                      icon="receipt"
                      iconColor="bg-blue-200"
                    />
                  </div>
                  <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                    <StatBox
                      title={"invoices OUT (-)"}
                      value={stats?.invoices_gain?.out}
                      unit={"MAD"}
                      icon="receipt"
                      iconColor="bg-red-200"
                    />
                  </div>
                  <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                    <StatBox
                      title={"delivered IN (+)"}
                      value={stats?.delivered_gain?.in}
                      unit={"MAD"}
                      icon="motorcycle"
                      iconColor="bg-green-300"
                    />
                  </div>
                  <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                    <StatBox
                      title={"delivered OUT (-)"}
                      value={stats?.delivered_gain?.out}
                      unit={"MAD"}
                      icon="motorcycle"
                      iconColor="bg-red-200"
                    />
                  </div>
                  <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                    <StatBox
                      title={"refused gain"}
                      value={stats?.refused_gain}
                      unit={"MAD"}
                      icon="ban"
                      iconColor="bg-red-200"
                    />
                  </div>
                  <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                    <StatBox
                      title={"warehousing gain"}
                      value={stats?.warehousing_gain}
                      unit={"MAD"}
                      icon="warehouse"
                      iconColor="bg-purple-300"
                    />
                  </div>
                  <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                    <StatBox
                      title={"transfers gain"}
                      value={stats?.transfers_gain}
                      unit={"MAD"}
                      icon="truck"
                      iconColor="bg-green-200"
                    />
                  </div>
                  <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                    <Link to="/orders">
                      {/* status?=fulfilled */}
                      <StatBox
                        title={tl("delivered")}
                        value={stats?.fulfilled_orders}
                        unit={tl("orders")}
                        icon="check-double"
                        iconColor="bg-green-500"
                      />
                    </Link>
                  </div>
                  <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                    <Link to="/orders">
                      <StatBox
                        title={tl("pending")}
                        value={stats?.active_orders}
                        unit={tl("orders")}
                        icon="motorcycle"
                        iconColor="bg-yellow-500"
                      />
                    </Link>
                  </div>
                  <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                    <Link to="/cycles">
                      <StatBox
                        title={tl("completion_rate")}
                        value={stats?.completion_rate > 0 ? (stats?.completion_rate * 100).toFixed(2) : 0}
                        unit={"%"}
                        icon="percent"
                        iconColor="bg-gray-500"
                      />
                    </Link>
                  </div>
                  {/* <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                    <Link to="/cycles">
                      <StatBox
                        title={tl("earning")}
                        value={stats?.profit > 0 ? stats?.profit.toFixed(2) : 0}
                        unit={"dh"}
                        icon="money-bill"
                        iconColor="bg-gray-700"
                      />
                    </Link>
                  </div> */}
                </>
              )}
            </div>
          </div>
        </div>
        <div
          className="absolute bg-gradient-to-r from-green-500 to-green-600 left-0 right-0"
          style={{ top: -600, bottom: -75, zIndex: -1 }}
        ></div>
      </div>
      {/* */}
      <div className="px-4 md:px-10 mx-auto w-full -mt-24 mb-24">
        <div className="flex flex-wrap">
          <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
            <OrdersReportCard />
          </div>
          {/* <div className="w-full xl:w-4/12 px-4">
            <FinancialReportCard /> 
          </div> */}
        </div>
      </div>
      {/*  */}
    </Fragment>
  );
}
