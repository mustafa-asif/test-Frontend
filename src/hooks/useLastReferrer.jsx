import { useEffect } from "react";
import { xFetch } from "../utils/constants";
import { useRouteQuery } from "./useRouteQuery";

const REFERRER_QUERY = "r";

export const useLastReferrer = () => {
  const referrer_id = useRouteQuery(REFERRER_QUERY);
  useEffect(() => {
    if (referrer_id) {
      cacheReferrer(referrer_id);
      tallyReferrerID(referrer_id);
    }
  }, [referrer_id]);
};

function cacheReferrer(_id) {
  localStorage.setItem(`$${REFERRER_QUERY}`, JSON.stringify({ _id, date: Date.now() }));
}

function tallyReferrerID(_id) {
  xFetch(`/visits/${_id}`).then(console.log).catch(console.error);
}

export function getCachedReferrer() {
  const cached = localStorage.getItem(`$${REFERRER_QUERY}`);
  if (!cached) return;
  try {
    const { _id, date } = JSON.parse(cached);
    if (!_id || !date) return;
    const thirtyDaysAgo = Date.now() - 1000 * 60 * 60 * 24 * 30;
    if (date < thirtyDaysAgo) throw new Error("referrer_id too old expired");
    return _id;
  } catch (err) {
    console.log(err);
    localStorage.removeItem(`$${REFERRER_QUERY}`);
    return undefined;
  }
}
