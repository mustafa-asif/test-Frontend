import { Fragment, useEffect, useState } from "react";
import { globalFilterToQuery } from "../../utils/misc";
import { xFetch } from "../../utils/constants";

export const TotalDisplay = ({ model, filter, loading }) => {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [error, setError] = useState(null);

  async function fetchDocs() {
    if (isLoading || loading) return;
    setLoading(true);
    const query = globalFilterToQuery(filter);
    const { data, error } = await xFetch(`/${model}/total`, undefined, undefined, undefined, query);
    setLoading(false);
    if (error) setError(error);
    else setData(data);
  }

  useEffect(() => {
    fetchDocs();
  }, [filter.from_date, filter.to_date]);

  return (
    <div className="p-4 bg-white shadow-lg rounded-full flex items-center justify-between h-12 min-w-[230px]">
      <div className="flex items-center">
        {isLoading ? (
          <span className="h-6 w-[20px] mr-[15px] bg-gray-200 rounded-full animate-pulse"></span>
        ) : (
          <span className="text-2xl mr-[5px] opacity-50">{data.orders ?? "-"}</span>
        )}
        <i className={`text-lg fas fa-motorcycle mr-[5px] text-gray-500`}></i>

        {isLoading ? (
          <span className="h-6 w-[20px] mr-[15px] bg-gray-200 rounded-full animate-pulse"></span>
        ) : (
          <span className="text-2xl mr-[5px] opacity-50">{data.count ?? "-"}</span>
        )}

        <i className={`text-lg fas fa-cash-register mr-[15px] text-gray-500`}></i>
      </div>

      <div className="flex items-center">
        {isLoading ? (
          <span className="h-6 w-32 bg-gray-200 rounded-full animate-pulse"></span>
        ) : (
          <Fragment>
            <span className="text-green-500 text-2xl">{data.total?.toLocaleString() ?? "-"}</span>
            <span className="font-semibold text-xs ml-[5px] mt-1">{"DH"}</span>
          </Fragment>
        )}
      </div>
    </div>
  );
};
