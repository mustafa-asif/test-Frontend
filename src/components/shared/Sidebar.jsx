import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import { useStoreState } from "easy-peasy";
import { Fragment, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "../../i18n/provider";
import { logoIcon } from "../../tenant-config";
import { IconButton } from "./Button";
import { useAccessRestrictions } from "../../hooks/useAccessRestrictions";

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} componentsProps={{ tooltip: { className: className } }} />
))(`
    color: #ffffff;
    background-color: rgba(31, 41, 55, 0.87);
    font-size: 1rem;
    font-weight: bold;
    font-family: nunito, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial;
`);

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [collapsedOnDesktop, setCollapsedOnDesktop] = useState(false);
  const location = useLocation();

  const contClass = (() => {
    let name = `flex bg-white absolute left-0 top-0 h-full w-full min-h-screen md:relative z-50 transition-all duration-300 ${collapsedOnDesktop ? "md:w-16" : "md:w-60"}`;
    if (!collapsed) return name;
    return name + " hidden md:block";
  })();

  function toggleCollapsed() {
    setCollapsed((val) => !val);
  }

  function toggleCollapsedOnDesktop() {
    setCollapsedOnDesktop((val) => !val);
  }

  useEffect(() => {
    if (!collapsed) setCollapsed(true);
  }, [location.pathname]);

  return (
    <Fragment>
      <IconButton
        icon="bars"
        onClick={toggleCollapsed}
        className="absolute left-4 top-3 md:hidden z-50 text-gray-800"
        iconColor="gray"
      />
      <div
        className={contClass}
        style={{
          boxShadow: "5px 0px 30px rgba(0, 0, 0, 0.1), inset 0 0px 15px 0 rgba(0, 0, 0, 0.2)",
        }}>
        <IconButton
          icon="times"
          onClick={toggleCollapsed}
          className="absolute right-5 top-3 md:hidden z-40 text-gray-800"
          iconColor="gray"
        />
        <div className={`flex flex-col items-center flex-1 py-3 overflow-y-auto min-w-full max-h-screen ${collapsedOnDesktop ? "" : "md:items-start"}`}>
          <div>
            <Link to="/dashboard" className="w-full">
              <div className={`flex flex-row gap-4 items-center justify-start w-full ${collapsedOnDesktop ? "px-3" : "px-5"}`}>
                <img className="w-8 mb-3" src={logoIcon} />
                <p className={`text-3xl font-bold text-secondary ${collapsedOnDesktop ? "md:hidden" : "md:block"}`}>Livo</p>
              </div>
            </Link>
            <IconButton
              icon="bars"
              onClick={toggleCollapsedOnDesktop}
              className="hidden md:block absolute top-0 scale-75 left-full z-50 text-gray-800"
              iconColor="gray"
            />
          </div>

          <NavContent isCollapsedOnDesktop={collapsedOnDesktop} />
        </div>
      </div>
    </Fragment>
  );
};

function NavContent({ isCollapsedOnDesktop }) {
  const user = useStoreState((state) => state.auth.user);
  const { canAccessPage } = useAccessRestrictions();

  switch (user.role || "client") {
    case "client":
      return (
        <div className="w-full flex flex-1 flex-col  min-w-full md:items-start">
          <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/dashboard" icon="chart-bar" title="dashboard" />
          <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/orders" icon="motorcycle" title="orders" />
          <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/pickups" icon="dolly" title="pickups" badge={0} />
          {user.client.pack?.startsWith("stockage") && (
            <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/transfers" icon="truck" title="transfers" badge={0} />
          )}
          <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/products" icon="warehouse" title="products" badge={0} />
          {user.client.sms?.enabled && (
            <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/auto-sms" icon="sms" title="Auto SMS" badge={0} />
          )}
          {user.isMainUser && (
            <>
              <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/returns" icon="reply" title="retours" badge={0} />
              <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/cycles" icon="credit-card" title="payments" badge={0} />
            </>
          )}
        </div>
      );

    case "followup":
      return (
        <div className="w-full flex flex-1 flex-col  min-w-full md:items-start">
          {canAccessPage("orders") && <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/orders" icon="motorcycle" title="orders" />}
          {canAccessPage("pickups") && (
            <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/pickups" icon="dolly" title="pickups" badge={0} />
          )}
          {canAccessPage("transfers") && (
            <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/transfers" icon="truck" title="transfers" badge={0} />
          )}
          {canAccessPage("products") && (
            <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/products" icon="warehouse" title="products" badge={0} />
          )}
          {canAccessPage("purges") && (
            <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/returns" icon="reply" title="returns" badge={0} />
          )}
          {canAccessPage("clients") && (
            <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/clients" icon="user" title="clients" badge={0} />
          )}
          {canAccessPage("warehouses") && (
            <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/warehouses" icon="warehouse" title="warehouses" badge={0} />
          )}
          {canAccessPage("tickets") && (
            <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/tickets" icon="question-circle" title="reclamations" badge={0} />
          )}
          {canAccessPage("debug") && <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/debug" icon="bug" title="Debug" badge={0} />}
          <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/logout" icon="sign-out-alt" title="logout" badge={0} />
        </div>
      );
    case "warehouse": {
      const { warehouse } = user;
      const canOrder = warehouse.main || warehouse.options.orders;
      const canPickup = warehouse.main || warehouse.options.pickups;
      const canReturn = warehouse.main || warehouse.options.returns;
      return (
        <div className="w-full flex flex-1 flex-col  min-w-full md:items-start">
          {canOrder && canAccessPage("orders") && (
            <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/orders" icon="motorcycle" title="orders" />
          )}
          {canPickup && canAccessPage("pickups") && (
            <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/pickups" icon="dolly" title="pickups" badge={0} />
          )}
          {canAccessPage("transfers") && (
            <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/transfers" icon="truck" title="transfers" badge={0} />
          )}
          {canAccessPage("containers") && (
            <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/containers" icon="box-open" title="containers" badge={0} />
          )}
          {canAccessPage("products") && (
            <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/products" icon="warehouse" title="products" badge={0} />
          )}
          {canReturn && canAccessPage("purges") && (
            <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/returns" icon="reply" title="returns" badge={0} />
          )}
          {canAccessPage("invoices") && (
            <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/invoices" icon="receipt" title="invoices" badge={0} />
          )}
          {canAccessPage("cycles") && (
            <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/cycles" icon="credit-card" title="cycles" badge={0} />
          )}
          {canAccessPage("deliverers") && (
            <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/deliverers-cycles" icon="credit-card" title="deliverer_cycles" badge={0} />
          )}
          {canAccessPage("deliverers") && (
            <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/deliverers" icon="users" title="deliverers" badge={0} />
          )}
          {canAccessPage("account") && (
            <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/account" icon="cog" title="account" badge={0} />
          )}
          <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/logout" icon="sign-out-alt" title="logout" badge={0} />
        </div>
      );
    }
    case "deliverer": {
      const { options } = user.deliverer;
      const canDeliver = options.orders;
      const canPickup = options.pickups && user.deliverer.warehouse.options.pickups;
      const canReturn = user.deliverer.warehouse.main && options.purges

      return (
        <div className="w-full flex flex-1 flex-col  min-w-full md:items-start">
          {canDeliver && <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/orders" icon="motorcycle" title="orders" />}
          {canPickup && <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/pickups" icon="dolly" title="pickups" badge={0} />}
          {canReturn && <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/returns" icon="reply" title="retours" badge={0} />}
          <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/products" icon="warehouse" title="products" badge={0} />
          <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/cycles" icon="credit-card" title="cycles" badge={0} />
          <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/logout" icon="sign-out-alt" title="logout" badge={0} />
        </div>
      );
    }
    case "payman":
      return (
        <div className="w-full flex flex-1 flex-col  min-w-full md:items-start">
          {canAccessPage("client-cycles") && <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/client-cycles" icon="credit-card" title="clients_cashouts" badge={0} />}
          {canAccessPage("warehouse-cycles") && <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop}
            href="/warehouse-cycles"
            icon="warehouse"
            title="warehouses_payments"
            badge={0}
          />}
          {canAccessPage("tenant-cycles") && <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/tenant-cycles" icon="palette" title="tenant_cashouts" badge={0} />}
          {canAccessPage("payments") && <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/payments" icon="receipt" title="payments" badge={0} />}
          <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/logout" icon="sign-out-alt" title="logout" badge={0} />
        </div>
      );
    case "admin":
      return (
        <div className="w-full flex flex-1 flex-col  min-w-full md:items-start">
          <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/payments" icon="receipt" title="payments" badge={0} />
          <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/warehouses" icon="warehouse" title="warehouses" badge={0} />
          <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/clients" icon="user-check" title="Clients" badge={0} />
          {/* <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/shippers" icon="shipping-fast" title="shippers" badge={0} /> */}
          <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/fees" icon="money-bill" title="fees" badge={0} />
          <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/cities" icon="city" title="cities" badge={0} />
          <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/snapshots" icon="cog" title="snapshots" badge={0} />
          <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/users" icon="user-friends" title="users" badge={0} />
          <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/banners" icon="info" title="banners" badge={0} />
          <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/support-categories" icon="ticket-alt" title="Categories" badge={0} />
          <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/auto-messages" icon="comments" title="Auto Messages" badge={0} />
          <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/auto-sms" icon="sms" title="auto sms" badge={0} />
          <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/runs" icon="tasks" title="runs" badge={0} />
          <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/system-events" icon="history" title="System Events" badge={0} />
          <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/logout" icon="sign-out-alt" title="logout" badge={0} />
        </div>
      );
    case "commercial":
      return (
        <div className="w-full flex flex-1 flex-col  min-w-full md:items-start">
          <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/clients" icon="user-check" title="Clients" badge={0} />
          <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/fetuses" icon="baby" title="Fetuses" badge={0} />
          <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/logout" icon="sign-out-alt" title="logout" badge={0} />
        </div>
      );
    case "tenant":
      return (
        <div className="w-full flex flex-1 flex-col  min-w-full md:items-start">
          <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/cycles" icon="credit-card" title="cycles" badge={0} />
          <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/account" icon="cog" title="Account" badge={0} />
          <NavItem isCollapsedOnDesktop={isCollapsedOnDesktop} href="/logout" icon="sign-out-alt" title="logout" badge={0} />
        </div>
      );
    default:
      return <></>;
  }
}

function NavItem({ href, title, icon, badge, strict, isCollapsedOnDesktop }) {
  const location = useLocation();
  const tl = useTranslation();
  const regex = new RegExp(!strict ? `^${href.split("?")[0]}` : href);
  const isActive = regex.test(location.pathname);
  return (
    <StyledTooltip
      title={(tl(title) || title).toUpperCase()}
      placement="right"
      className={`${isCollapsedOnDesktop ? "" : "hidden"}`}
      PopperProps={{
        popperOptions: {
          modifiers: [
            {
              name: "offset",
              options: { offset: [0, -10] },
            },
          ],
        },
      }}>
      <NavLink
        to={href}
        className={`bg-transparent py-14 md:py-0 md:px-5 md:w-full transtion-colors duration-300 flex flex-col md:flex-row md:gap-5 items-center justify-center ${isCollapsedOnDesktop ? "" : "md:justify-start"} text-gray-500 hover:text-white hover:bg-gray-600`}
        activeClassName={"!bg-gray-800 text-white pointer-events-none"}
        style={{
          height: isActive ? 80 : 60,
          boxShadow: isActive ? "" : "",
        }}
      //
      >
        <i className={`fas fa-${icon} ${isCollapsedOnDesktop ? "text-2xl" : "text-xl"} w-10 block text-center text-gray-400 ${isActive ? "text-primary" : ""}`}>
        </i>
        {badge > 0 && (
          <span className="absolute -top-3">
            <div className="inline-flex items-center px-1.5 py-0.5 border-2 border-white rounded-full text-xs font-semibold leading-4 bg-red-500 text-white">
              {badge}
            </div>
            {!true && (
              <span className="animate-ping absolute right-0 z-40 inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            )}
          </span>
        )}

        <p className={`hidden text-lg font-bold capitalize ${isCollapsedOnDesktop ? "md:hidden" : "md:block"}`}>{tl(title) || title}</p>

        <p
          className={`text-lg font-bold block md:hidden text-center uppercase ${isActive ? "text-white" : ""}`}>
          {" "}
          {tl(title) || title}
        </p>
      </NavLink>
    </StyledTooltip>
  );
}
