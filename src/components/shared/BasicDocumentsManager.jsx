import { Fragment, useState, useCallback, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import { useUpdates } from "../../hooks/useUpdates";
import { useStoreState, useStoreActions } from "easy-peasy";
import { NoSearchResults } from "./NoSearchResults";
import { CircularProgress } from "@mui/material";
import { useTypeCallback } from "../../hooks/useTypeCallback";
import useFirstVisit from "../../hooks/useFirstVisit";
import useNextEffects from "../../hooks/useNextEffects";
import { useScrollHandler } from "./ScrollContainer";
import { xFetch } from "../../utils/constants";
import { RefreshButton } from "./RefreshButton";
import { StatusCombobox } from "./StatusCombobox";
import { NothingCard } from "./NothingCard";
import { IconInput } from "./Input";
import { getDepsFromObjs, getBgColor, globalFilterToQuery } from "../../utils/misc";
import { useScan, useShowItem } from "./ToolsProvider";
import { DateFilter, NewDateFilter } from "./DateFilter";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import { usePersistantFilters } from "./FiltersProvider";
import { useTranslation } from "../../i18n/provider";
import { IconButton } from "./Button";
import { DelivererCombobox } from "../warehouse/DelivererCombobox";
import { WarehouseCombobox } from "../followup/WarehouseCombobox";
import { TagsCombobox } from "../shared/TagsCombobox";
import { DirectionFilter } from "../warehouse/DirectionFilter";
import { SortFilter } from "./SortFilter";
import { getDatePlusDays, getToday } from "../../utils/misc";
import { ColorBanner } from "./ColorBanner";

export const BasicDocumentsManager = ({
  processDocuments = docs => docs,
  DocumentCard,
  LoadingCard,
  resourceRoute = undefined,
  customApi = undefined,
  title = "",
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [cancelFunc, setCancelFunc] = useState(null);

  const tl = useTranslation();
  const user = useStoreState(state => state.auth.user);
  const showToast = useToast();

  function fetchDocuments() {
    const promise = async function (signal) {
      console.log("fetching more documents");
      cancelFunc?.();

      const { data, error, aborted } = await xFetch(`${resourceRoute}`, { signal }, false, customApi);

      if (aborted) return;
      setCancelFunc(null);

      setLoading(false);

      if (error) return showToast(error, "error");
      if (data?.length > 0) setDocuments(data);
    };

    const controller = new AbortController();
    const cancel = () => {
      controller.abort();
      setCancelFunc(null);
    };

    promise(controller.signal);
    setCancelFunc(() => cancel);
  }

  useEffect(() => {
    console.log("exec from init");
    fetchDocuments();
  }, []);

  return (
    <Fragment>
      <div className="pb-10 relative">
        <div className="lg:grid flex flex-col gap-3 w-full px-4 md:px-10">{children}</div>
        <ColorBanner />
      </div>
      <div className="relative px-4 md:px-10 mx-auto w-full  mb-24">
        <p className="text-xl font-semibold mb-3 bg-white w-max px-2">{title}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 w-full pb-6 overflow-hidden">
          {processDocuments(documents, user).map(doc => (
            <DocumentCard key={doc._id} {...doc} />
          ))}
          {loading && [...Array(4)].map((e, i) => <LoadingCard key={i} />)}
          {!loading && documents.length < 1 && (
            <NothingCard>
              <p>no results</p>
            </NothingCard>
          )}
        </div>
      </div>
    </Fragment>
  );
};
