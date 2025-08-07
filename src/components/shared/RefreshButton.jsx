import { useStoreActions, useStoreState } from "easy-peasy";
import { useEffect, useState } from "react";
import { xFetch } from "../../utils/constants";
import { cl, globalFilterToQuery } from "../../utils/misc";

export const RefreshButton = ({
  model,
  filter,
  isLoading: propsLoading,
  customApi = undefined,
  refreshOnMount = false,
  sort = undefined,
  ...props
}) => {
  const [freshLoading, setFreshLoading] = useState(false);
  const stateLoading = useStoreState((state) => state[model].loading);

  const isLoading = propsLoading || freshLoading || stateLoading;

  const documents_length = useStoreState((state) => state[model][model].length);
  const setDocuments = useStoreActions(
    (actions) => actions[model][`set${model[0].toUpperCase() + model.slice(1)}`]
  );
  async function refreshDocuments() {
    if (isLoading) return;
    setFreshLoading(true);
    const rest = globalFilterToQuery(filter);
    const query = [...rest];
    if (documents_length) {
      query.push(`_limit=${documents_length}`);
    }
    if (sort) query.push(`_sort=${sort}`);

    const { data, error } = await xFetch(`/${model}`, undefined, false, customApi, query);
    setFreshLoading(false);
    if (error) {
      return console.error("error");
    }
    setDocuments({ [model]: data });
  }

  useEffect(() => {
    console.log("mounted");
    if (refreshOnMount && !isLoading) {
      console.log("refresh called");
      refreshDocuments();
    }
  }, []);

  let defaultClass = `relative w-12 h-12 min-w-12 min-h-12 text-2xl bg-white  text-green-700 inline-flex items-center justify-center rounded-full shadow-lg hover:shadow-xl hover:bg-green-100 transition duration-300 ${
    isLoading ? "opacity-75 pointer-events-none" : ""
  }`;
  return (
    <button className={defaultClass} {...props} onClick={refreshDocuments} disabled={isLoading}>
      <i className={`fas fa-sync ${isLoading ? "animate-spin" : ""}`}></i>
    </button>
  );
};

export const CrudeRefreshButton = ({
  isLoading = false,
  disabled = false,
  isSuggested = false,
  ...props
}) => {
  return (
    <button
      className={cl(
        "relative w-12 h-12 min-w-12 min-h-12 text-2xl bg-white text-green-700 inline-flex items-center justify-center rounded-full shadow-lg hover:shadow-xl hover:bg-green-100 transition duration-300 ",
        { "opacity-60 pointer-events-none": disabled },
        { "animate-pulse bg-green-300": isSuggested }
      )}
      {...props}
      disabled={isLoading || disabled}>
      <i className={cl("fas fa-sync", { "animate-spin": isLoading })}></i>
    </button>
  );
};
