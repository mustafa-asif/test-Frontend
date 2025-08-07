import { useState, useEffect } from "react";
import { xFetch } from "../../utils/constants";

export const Profit = ({ medium }) => {
  const [balance, setBalance] = useState(0);
  const [isLoading, setLoading] = useState(true);

  async function updateBalance() {
    const { data, error } = await xFetch(`/balance/system`, undefined, undefined, undefined, [
      `medium=${medium}`,
    ]);
    setLoading(false);
    if (error) return console.error(error);
    if (typeof data === "number") setBalance(data);
  }

  useEffect(() => {
    updateBalance();
  }, []);

  return (
    <div className="p-4 bg-white shadow-lg hover:shadow-xl transition duration-300 rounded-full z-10 text-2xl font-bold uppercase flex items-center justify-center h-12">
      <i
        className={`fas pr-2 fa-${
          medium === "bank" ? "university" : "hand-holding-usd"
        } text-gray-500`}></i>
      {isLoading ? (
        <span className="h-6 w-32 bg-gray-200 rounded-full animate-pulse"></span>
      ) : (
        <span className="text-green-500">{balance.toFixed(2)}</span>
      )}
      <span className="font-semibold text-xs ml-1 mt-1">{"DH"}</span>
    </div>
  );
};
