import { useStoreState } from "easy-peasy";
import { Link } from "react-router-dom";
import { imgSrc } from "../../utils/constants";
import { LargeTableSkeleton } from "../skeletons/LargeTableSkeleton";

export const TopProductsCard = () => {
  const { loading, error, topProducts } = useStoreState(state => state.dashboard);

  if (loading) {
    return <LargeTableSkeleton />;
  }

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full px-4 max-w-full grow flex-1">
            <h3 className="font-semibold text-xl text-gray-700">{"Top Selling Products"}</h3>
          </div>
          <div className="relative w-full px-4 max-w-full grow flex-1 text-right">
            <Link to="/products">
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white text-xs font-bold uppercase px-3 py-1 rounded-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
              >
                {"See all"}
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className="block w-full overflow-x-auto">
        <table className="items-center w-full bg-transparent border-collapse">
          <thead>
            <tr>
              <th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-md uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                {"product"}
              </th>
              <th className="px-6 bg-green-50 text-green-500 align-middle border border-solid border-green-100 py-3 text-md uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
                {"delivered"}
              </th>
              <th className="px-6 bg-yellow-50 text-yellow-500 align-middle border border-solid border-yellow-100 py-3 text-md uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center">
                {"pending"}
              </th>
            </tr>
          </thead>
          <tbody className="text-center">
            {topProducts?.map((product, i) => (
              <ProductRow key={i} {...product} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function ProductRow({ name, image, delivered, pending, earning }) {
  return (
    <tr>
      <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
        <img alt="Product" src={imgSrc(image)} className="h-12 w-12 bg-white rounded-full border"></img>{" "}
        <span className="ml-3 font-bold text-xl text-gray-600">{name}</span>
      </th>
      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xl whitespace-nowrap p-4">{delivered}</td>
      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xl whitespace-nowrap p-4">{pending}</td>
    </tr>
  );
}
