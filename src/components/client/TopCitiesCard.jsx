import { useStoreState } from "easy-peasy";
import { Link } from "react-router-dom";
import { SmallTableSkeleton } from "../skeletons/SmallTableSkeleton";

export const TopCitiesCard = () => {
  const { loading, error, topCities } = useStoreState(state => state.dashboard);

  if (loading) {
    return <SmallTableSkeleton />;
  }

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full px-4 max-w-full grow flex-1">
            <h3 className="font-semibold text-xl text-gray-700">{"Top Cities"}</h3>
          </div>
          <div className="relative w-full px-4 max-w-full grow flex-1 text-right">
            <Link to="/orders?status=fulfilled">
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white text-xs font-bold uppercase px-3 py-1 rounded-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
              >
                {"see all"}
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className="block w-full overflow-x-auto">
        <table className="items-center w-full bg-transparent border-collapse">
          <thead className="thead-light">
            <tr>
              <th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-md uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                {"city"}
              </th>
              <th className="px-6 bg-green-50 text-green-500 align-middle border border-solid border-green-100 py-3 text-md uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
                {"delivered"}
              </th>
            </tr>
          </thead>
          <tbody className="text-center">
            {topCities?.map((city, i) => (
              <CityRow key={i} {...city} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function CityRow({ name, delivered }) {
  return (
    <tr>
      <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xl whitespace-nowrap p-4 text-left capitalize">
        {name}
      </th>
      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xl whitespace-nowrap p-4">{delivered}</td>
    </tr>
  );
}
