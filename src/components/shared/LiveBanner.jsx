import { Fragment, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { xFetch } from "../../utils/constants";
import { cl } from "../../utils/misc";

export const LiveBanner = ({}) => {
  const [banners, setBanners] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const location = useLocation();

  const matchingBanners = useMemo(() => {
    console.log("pathname or banners changed, recalculating matching banners");
    return banners.filter((banner) => {
      if (!banner.target.page_paths?.length) return true; // for all pages
      return banner.target.page_paths.some((path) => path === location.pathname); // matches current page
    });
  }, [location.pathname, banners.length]);

  useEffect(() => {
    fetchPageBanners();
  }, []);

  async function fetchPageBanners() {
    const { data, error } = await xFetch(`/banners/matching`, undefined, undefined, undefined, [
      `page_path=*`,
    ]);
    setLoading(false);
    if (error) console.log(error, "failed to get banners");
    else setBanners(data);
  }

  return (
    <div className="flex-none flex flex-col gap-y-3 p-3">
      {matchingBanners.map((ban) => (
        <div
          key={ban.text}
          className={cl(
            "ml-16 md:ml-0 bg-yellow-100 flex items-center justify-center shadow-md cursor-default hover:shadow-lg py-2 px-3"
          )}
          style={{ minHeight: 50 }}>
          {ban.text}
        </div>
      ))}
    </div>
  );
};
