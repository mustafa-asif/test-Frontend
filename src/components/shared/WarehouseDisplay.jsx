import { Pic } from "../shared/Pic";

export const WarehouseDisplay = ({ warehouse: user, fullWidth = false }) => {
  return (
    <div
      className={`${fullWidth ? "col-span-4" : "col-span-2"
        } rounded-full h-10 flex items-center bg-yellow-100 hover:bg-gray-800 hover:text-green-500 shadow-sm hover:shadow-md transition duration-300`}>
      <Pic fallback="warehouse" image={user?.image} className="mr-2" />
      <a className="line-clamp-1" href={`tel:${user?.phone || user?.user?.phone}`}>
        {user?.name}
      </a>
    </div>
  );
};

export const WarehouseDisplay2 = ({ warehouse }) => {
  return (
    <div
      className={`col-span-4 rounded-full h-10 flex items-center bg-gray-100 hover:bg-gray-800 hover:text-green-500 shadow-sm hover:shadow-md transition duration-300`}>
      <Pic image={warehouse.user?.image} className="mr-2" />
      <a className="line-clamp-1" href={`tel:${warehouse.user?.phone}`}>
        <i className="fas fa-warehouse text-lg mr-2"></i> {warehouse.user?.name} ({warehouse.name})
      </a>
      <span className="ml-2">
        <i className="fas fa-warehouse text-lg mr-2"></i> {warehouse.user?.name} ({warehouse.name})
      </span>

      <a
        href={`https://wa.me/212${+warehouse.user.phone}`}
        target="_blank"
        rel="noreferrer"
        className="ml-auto mr-1">
        <i className="fab fa-whatsapp bg-green-500 text-white rounded-full p-1.5"></i>
      </a>
    </div>
  );
};

export const WarehouseDisplay3 = ({ warehouse }) => {
  return (
    <div
      className={`col-span-4 rounded-full h-10 flex items-center bg-gray-100 hover:bg-gray-800 hover:text-green-500 shadow-sm hover:shadow-md transition duration-300`}>
      <div className="line-clamp-1">
        <i className="fas fa-warehouse text-lg mr-2"></i> {warehouse.name} ({warehouse.city})
      </div>
    </div>
  );
};
