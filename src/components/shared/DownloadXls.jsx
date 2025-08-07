import { useMemo } from "react";
import { API_URL } from "../../utils/constants";
import { globalFilterToQuery } from "../../utils/misc";

export const DownloadXls = ({ customApi, model, filter, sort, onClick }) => {
  const href = useMemo(() => {
    const rest = globalFilterToQuery(filter);
    const query = [...rest];
    if (sort) query.push(`_sort=${sort}`);

    return `${customApi || API_URL}/${model}/file.xls?${query.join("&")}`;
  }, [model, filter, sort, customApi]);

  const handleClick = async (e) => {
    if (onClick) {
      await onClick();
    }
  };

  return (
    <a
      className="relative w-12 h-12 min-w-12 min-h-12 text-2xl bg-white  text-green-700 inline-flex items-center justify-center rounded-full shadow-lg hover:shadow-xl hover:bg-green-100 transition duration-300"
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={handleClick}>
      <i className="fas fa-download"></i>
    </a>
  );
};
