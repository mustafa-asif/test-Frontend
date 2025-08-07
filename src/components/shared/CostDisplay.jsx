export const CostDisplay = ({ cost }) => (
  <div className="rounded-full text-lg h-10 flex items-center col-span-1 font-bold bg-gray-100 shadow-sm justify-center">
    <span className="text-green-500">{cost}</span>
    <span className="font-semibold text-xs ml-1 mt-1">DH</span>
  </div>
);
