import { Fragment, useEffect, useState } from "react";
import { xFetch } from "../../utils/constants";
import { useTranslation } from "../../i18n/provider";
import { useStoreState } from "easy-peasy";

export const ItemsCount = ({ ...props }) => {
  const [isLoading, setLoading] = useState(true);
  const [itemsCount, setItemsCount] = useState(0);
  const [recentlyScannedCount, setRecentlyScannedCount] = useState(0);
  const tl = useTranslation();
  const user = useStoreState((state) => state.auth.user);
  const [percentage, setPercentage] = useState(0);

  async function getItemsCount() {
    const { data, error } = await xFetch(`/items/count`);
    setLoading(false);
    if (error) return console.error(error);
    setItemsCount(data);
  }

  async function getRecentlyScannedCount() {
    const { data, error } = await xFetch(`/items/count?filter=recently_scanned`);
    if (error) return console.error(error);
    setRecentlyScannedCount(data);
  }

  useEffect(() => {
    getItemsCount();
    getRecentlyScannedCount();
  }, []);

  useEffect(() => {
    if (itemsCount > 0 && recentlyScannedCount >= 0) {
      const pct = (recentlyScannedCount / itemsCount) * 100;
      setPercentage(pct);
      console.log("Recently scanned items count:", recentlyScannedCount);
      console.log("Total items count:", itemsCount);
      console.log("Percentage of recently scanned items:", pct.toFixed(2) + "%");
    }
  }, [itemsCount, recentlyScannedCount]);

  const isWarehouseProducts = user?.role === "warehouse" && window.location.pathname.includes("products");

  return (
    <Fragment>
      <div className="p-4 bg-white shadow-lg hover:shadow-xl transition duration-300 rounded-full z-10 text-2xl font-bold uppercase flex items-center justify-center h-12">
        <i className="fas fa-boxes pr-2 text-gray-500"></i>
        {isLoading ? (
          <div className="h-6 w-32 bg-gray-200 rounded-full animate-pulse"></div>
        ) : (
          <span className="text-green-500">{itemsCount ?? 0}</span>
        )}
        <span className="font-semibold text-xs ml-1 mt-1">{tl("items")}</span>
        {isWarehouseProducts && !isLoading && itemsCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 20 }}>
            <div style={{
              width: 120,
              height: 18,
              background: '#e5e7eb',
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 2px 8px 0 rgba(34,197,94,0.10)',
              marginRight: 10,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}>
              <div style={{
                width: `${percentage}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #16a34a 0%, #22d3ee 100%)',
                borderRadius: 12,
                transition: 'width 0.5s',
                boxShadow: '0 0 8px #16a34a55',
              }}></div>
            </div>
            <span style={{ fontWeight: 600, color: '#16a34a', minWidth: 48, textAlign: 'right' }}>{percentage.toFixed(2)}%</span>
          </div>
        )}
      </div>
    </Fragment>
  );
};
