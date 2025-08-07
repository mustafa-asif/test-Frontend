import { Fragment, useEffect, useRef, useState } from "react";
import { NothingCard } from "../../components/shared/NothingCard";
import { SearchCard } from "../../components/shared/SearchCard";
import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { useRouteQuery } from "../../hooks/useRouteQuery";
import { useToast } from "../../hooks/useToast";
import { xFetch } from "../../utils/constants";
import { ColorBanner } from "../../components/shared/ColorBanner";

export default function SearchPage(props) {
  const query = useRouteQuery("q");
  const abortController = useRef(null);
  const showToast = useToast();
  const [isLoading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  async function getSearchResults() {
    abortController.current?.abort();
    setLoading(true);
    setResults([]);
    abortController.current = new AbortController();
    const { data, error } = await xFetch(`/search/general?s=${query}`, {
      signal: abortController.current.signal,
    });
    setLoading(false);
    if (error) {
      return showToast(error, "error");
    }
    setResults(data);
    console.log(data);
  }

  useEffect(() => {
    console.log("query changed ", query);
    getSearchResults();
  }, [query]);

  return (
    <Fragment>
      <div className="relative pb-32" style={{ marginTop: -65, paddingTop: 75 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 w-full px-4 md:px-10">
          <p className="text-white text-xl">
            Showing results for <span className="text-gray-200 lowercase">{query}</span>
          </p>
        </div>
        <ColorBanner />
      </div>
      <div className="relative px-4 md:px-10 mx-auto w-full -mt-24 mb-24">
        <div className="grid grid-cols-1 gap-4 w-full pb-6 overflow-hidden">
          {isLoading && [...Array(4)].map((e, i) => <CardSkeleton partsCount={0} type={1} key={i} />)}
          {results.map(res => (
            <SearchCard key={res._id} {...res} word={query} />
          ))}
          {!isLoading && results.length < 1 && <NothingCard></NothingCard>}
        </div>
      </div>
    </Fragment>
  );
}
