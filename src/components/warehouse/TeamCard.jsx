export const TeamCard = () => {
  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full px-4 max-w-full grow flex-1">
            <h3 className="font-semibold text-xl text-gray-700">{"Team"}</h3>
          </div>
        </div>
      </div>
      <div className="block w-full overflow-x-auto p-10">{"Soon"}...</div>
    </div>
  );
};
