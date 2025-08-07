export const SmallTableSkeleton = () => {
  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full px-4 max-w-full grow flex-1">
            <div className="h-6 w-52 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
      <div className="block w-full overflow-x-auto">
        <table className="items-center w-full bg-transparent border-collapse">
          <thead className="thead-light">
            <tr className="h-12 bg-gray-200 animate-pulse">
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody className="text-center">
            {[...Array(5)].map((e, i) => (
              <Row key={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function Row() {
  return (
    <tr>
      <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4">
        <div className="h-6 w-36 bg-gray-200 rounded-full animate-pulse"></div>
      </th>
      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4">
        <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
      </td>
    </tr>
  );
}
