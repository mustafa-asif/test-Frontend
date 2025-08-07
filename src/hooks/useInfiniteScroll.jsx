import { useStore, useStoreActions, useStoreState } from "easy-peasy";
import { useCallback, useRef, useMemo } from "react";
import { useState } from "react";
import { xFetch } from "../utils/constants";
import { useToast } from "./useToast";
import { useScrollHandler } from "./../components/shared/ScrollContainer";
import useFirstVisit from "./useFirstVisit";
import { useUpdates } from "./useUpdates";
import { useSkipFirstEffect } from "./useSkipFirstEffect";

export const useInfiniteScroll = (model, increments = 3, filter, setFilter) => {
  const showToast = useToast();
  const startListeningWS = useUpdates(model);

  const [isLoading, setLoading] = useState(false);
  const [abortController, setAbortController] = useState(new AbortController());

  const documents_length = useStoreState((state) => state[model][model].length);
  const documents_loading = useStoreState((state) => state[model].loading);

  const addDocuments = useStoreActions(
    (actions) => actions[model][`add${model[0].toUpperCase() + model.slice(1)}`]
  );
  const setDocuments = useStoreActions(
    (actions) => actions[model][`set${model[0].toUpperCase() + model.slice(1)}`]
  );

  const fetchMoreDocuments = useCallback(
    async (storeLevel, clearFiltersIfNone, firstTime) => {
      console.log("running callback +", filter.status);

      if (isLoading || documents_loading) {
        if (abortController) abortController.abort();
        else return console.log("cant be aborted");
      }

      if (storeLevel) setDocuments({ loading: true, [model]: [] });
      else setLoading(true);

      const skip = storeLevel ? 0 : documents_length;
      const limit = increments;
      const rest = filterToQuery(filter);

      const newAbortController = !firstTime ? new AbortController() : null;
      setAbortController(newAbortController);

      const { data, error, aborted } = await xFetch(
        `/${model}`,
        { signal: newAbortController?.signal },
        undefined,
        undefined,
        [`_skip=${skip}`, `_limit=${limit}`, ...rest]
      );

      if (aborted) return;

      if (clearFiltersIfNone && data?.length < 1 && filter.status) {
        return setFilter(
          (filter) => ({ ...filter, status: "all" }),
          () => {
            fetchMoreDocuments(true);
          }
        );
      }

      if (storeLevel) setDocuments({ loading: false });
      else setLoading(false);

      if (error) {
        return showToast(error, "error");
      }
      addDocuments(data);
    },
    [increments, filter, isLoading, documents_length, documents_loading, abortController]
  );

  useScrollHandler(fetchMoreDocuments);

  useFirstVisit(() => {
    console.log("called first");
    fetchMoreDocuments(true, true, true);
    startListeningWS();
  }, model);

  useSkipFirstEffect(() => {
    fetchMoreDocuments(true);
  }, [filter]);

  return isLoading;
};

function filterToQuery(filter) {
  const query = [];

  if (filter.status && filter.status !== "all") {
    query.push(`status=${filter.status}`);
  }

  if (filter.keyword) {
    query.push(`keyword=${filter.keyword}`);
  }

  return query;
}
