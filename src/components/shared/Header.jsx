import { useStoreState } from "easy-peasy";
import { Fragment } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "../../i18n/provider";
import { getBgColor } from "../../utils/misc";
import { HeaderDropdowns } from "./HeaderDropdowns";

export const Header = () => {
  const user = useStoreState((state) => state.auth.user);
  if (!user) throw new Error(`user does not exist`);
  const location = useLocation();
  const title = getTitle(location.pathname);
  const tuto = getTutoUrl(title, user.role);
  const tl = useTranslation();

  return (
    <Fragment>
      <div
        className="w-full z-10 bg-transparent flex md:flex-row md:flex-nowrap md:justify-start items-center"
        style={{ minHeight: 65, maxHeight: 65 }}>
        <div className="w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-3">
          <span className="text-white text-xl mt-2 ml-16 mr-2 md:ml-0 md:text-2xl lg:inline-block font-semibold uppercase">
            {tl(title)}
            {tuto && (
              <a href={tuto} target="_blank" className="text-yellow-400 ml-2" rel="noreferrer">
                <i className="fas fa-question-circle"></i>
              </a>
            )}
            {title === "account" && user.client?.pack && (
              <span className="ml-3 text-xl uppercase bg-yellow-100 text-gray-700 py-2 px-3 font-bold rounded-full shadow-md">
                {user.client?.pack}
              </span>
            )}
            {title === "account" && user.tenant?.pack && (
              <span className="ml-3 text-xl uppercase bg-yellow-100 text-gray-700 py-2 px-3 font-bold rounded-full shadow-md">
                {user.tenant?.pack}
              </span>
            )}
          </span>
          {/* User */}
          <div className="mt-1 mr-1 md:mr-0">
            <HeaderDropdowns role={user.role} />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

function getTitle(path) {
  if (/^\/(view\/)?dashboard/.test(path)) return "dashboard";
  if (/^\/(view\/)?referrals/.test(path)) return "referrals";
  if (/^\/(view\/)?orders/.test(path)) return "orders";
  if (/^\/(view\/)?pickups/.test(path)) return "pickups";
  if (/^\/(view\/)?transfers/.test(path)) return "transfers";
  if (/^\/(view\/)?containers/.test(path)) return "containers";
  if (/^\/(view\/)?products/.test(path)) return "products";
  if (/^\/(view\/)?returns/.test(path)) return "returns";
  if (/^\/(view\/)?invoices/.test(path)) return "invoices";
  if (/^\/(view\/)?cycles/.test(path)) return "payments";
  if (/^\/(view\/)?client-cycles/.test(path)) return "clients_cashouts";
  if (/^\/(view\/)?warehouse-cycles/.test(path)) return "warehouses_payments";
  if (/^\/(view\/)?account/.test(path)) return "account";
  if (/^\/(view\/)?deliverers/.test(path)) return "deliverers";
  if (/^\/(view\/)?clients/.test(path)) return "clients";
  if (/^\/(view\/)?warehouses/.test(path)) return "warehouses";
  if (/^\/(view\/)?settings/.test(path)) return "settings";
  if (/^\/(view\/)?search/.test(path)) return "search";
  if (/^\/(view\/)?items/.test(path)) return "items";
  if (/^\/(view\/)?payments/.test(path)) return "payments";
  if (/^\/(view\/)?client-cycles/.test(path)) return "Client Payments";
  if (/^\/(view\/)?warehouse-cycles/.test(path)) return "Warehouse Payments";
  if (/^\/(view\/)?tenant-cycles/.test(path)) return "Tenant Payments";
  if (/^\/(view\/)?fees/.test(path)) return "fees";
  if (/^\/(view\/)?cities/.test(path)) return "cities";
  if (/^\/(view\/)?shippers/.test(path)) return "shippers";
  if (/^\/(view\/)?snapshots/.test(path)) return "snapshots";
  if (/^\/(view\/)?runs/.test(path)) return "runs";
  if (/^\/(view\/)?system-events/.test(path)) return "System Events";
  if (/^\/(view\/)?fetuses/.test(path)) return "fetuses";
  if (/^\/(view\/)?users/.test(path)) return "users";
  if (/^\/(view\/)?banners/.test(path)) return "banners";
  if (/^\/(view\/)?tickets/.test(path)) return "reclamations";
  if (/^\/(view\/)?support-categories/.test(path)) return "Support Categories";
  if (/^\/(view\/)?auto-messages/.test(path)) return "Auto Messages";
  if (/^\/(view\/)?debug/.test(path)) return "debug";
  if (/^\/(view\/)?auto-sms/.test(path)) return "Auto SMS";
  if (/^\/(view\/)?logout/.test(path)) return "";
  return "xx";
}

function getTutoUrl(title, role) {
  switch (role) {
    case "client":
      if (title === "orders") return "https://www.youtube.com/watch?v=SwLp0fe6PmE";
      if (title === "pickups") return "https://www.youtube.com/watch?v=72vnh8J5gJ0";
      if (title === "transfers") return "https://www.youtube.com/watch?v=d2y3QesZHTw";
      if (title === "products") return "https://www.youtube.com/watch?v=72vnh8J5gJ0";
      return "";
    case "warehouse":
    case "deliverer":
    default:
      return "";
  }
}
