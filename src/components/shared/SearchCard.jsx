import { Link } from "react-router-dom";

export const SearchCard = ({ _id, word, ...props }) => {
  const model = getModel(_id);
  const link = getLink(_id);
  return (
    <Link to={link}>
      <div className="p-4 bg-white shadow-lg hover:shadow-xl transition duration-300 rounded-md z-10 relative">
        <div className="grid grid-cols-4 gap-2">
          <div className="rounded-full text-sm font-light text-gray-400 hover:text-green-500 flex items-center col-span-2 -mt-1 cursor-pointer uppercase">
            {model.slice(0, -1)}
          </div>
          <div className="rrounded-full text-sm font-light text-gray-400 flex items-center col-span-2 justify-end -mt-1">
            {_id}
          </div>
        </div>
      </div>
    </Link>
  );
};

function getModel(id) {
  switch (id.slice(0, 2)) {
    case "or":
      return "orders";
    case "pi":
      return "pickups";
    case "tr":
      return "transfers";
    case "pr":
      return "products";
    case "co":
      return "containers";
    case "us":
      return "users";
    case "it":
      return "items";
    default:
      return "unknown";
  }
}
function getLink(id) {
  switch (id.slice(0, 2)) {
    case "or":
      return `/view/orders/${id}`;
    case "pi":
      return `/view/pickups/${id}`;
    case "tr":
      return `/view/transfers/${id}`;
    case "pr":
      return `/view/products/${id}`;
    case "co":
      return `/view/containers/${id}`;
    case "us":
      return `/view/users/${id}`;
    case "it":
      return `/view/items/${id}`;
    default:
      return ``;
  }
}
