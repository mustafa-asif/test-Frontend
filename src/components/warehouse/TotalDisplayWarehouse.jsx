import React, { useEffect, Fragment, useState } from "react";
import { xFetch } from "../../utils/constants";
import { globalFilterToQuery } from "../../utils/misc";

// Total display for warehouse
function TotalDisplayWarehouse({ model, filter, loading }) {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState({});

  async function fetchDocs() {
    if (isLoading || loading) return;

    setLoading(true);
    const query = globalFilterToQuery(filter);
    const { data, error } = await xFetch(
      `/${model}/total-cycles`,
      undefined,
      undefined,
      undefined,
      query
    );

    setLoading(false);

    if (error) setError(error);
    else setData(data);
  }

  useEffect(() => {
    fetchDocs();
  }, [filter]);

  return (
    <div className="p-4 bg-white shadow-lg rounded-full flex items-center justify-between h-12">
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
}

export default TotalDisplayWarehouse;
