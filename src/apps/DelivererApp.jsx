import { Switch, Route, Redirect } from "react-router-dom";
import { Footer } from "../components/shared/Footer";
import { Header } from "../components/shared/Header";
import { Sidebar } from "../components/shared/Sidebar";
import { ScrollContainer } from "../components/shared/ScrollContainer";
import OrdersPage from "../pages/deliverer/Orders";
import PickupsPage from "../pages/deliverer/Pickups";
import CyclesPage from "../pages/deliverer/Cycles";
import ProductsPage from "../pages/deliverer/Products";
import LogoutPage from "../pages/shared/Logout";
import SingleDocument from "../pages/deliverer/SingleDocument";
import DashboardPage from "../pages/deliverer/Dashboard";
import ScanPage from "../pages/shared/Scan";
import { RouteDialog } from "../components/shared/RouteDialog";
import { MessagesDialog } from "../components/shared/MessagesDialog";
import { PaymentsDialog } from "../components/shared/PaymentsDialog";
import { EventsDialog } from "../components/shared/EventsDialog";
import { FiltersProvider } from "../components/shared/FiltersProvider";
import { LiveBanner } from "../components/shared/LiveBanner";
import { useStoreState } from "easy-peasy";
import ReturnsPage from "../pages/deliverer/Returns";

export default function DelivererApp() {
  const canPurge = useStoreState((state) => state.auth.user.deliverer?.options.purges);
  return (
    <div className="flex">
      <Sidebar />
      <ScrollContainer className="flex flex-1 flex-col h-screen overflow-auto">
        <LiveBanner />
        <Header />
        <FiltersProvider>
          <div className="flex-1">
            <Switch>
              <Route path="/orders" component={OrdersPage} />
              <Route path="/pickups" component={PickupsPage} />
              <Route path="/cycles" component={CyclesPage} />
              <Route path="/products" component={ProductsPage} />
              {canPurge && <Route path="/returns" component={ReturnsPage} />}
              {/* <Route path="/dashboard" component={DashboardPage} /> */}
              <Route path={"/view/:model/:id"} component={SingleDocument} />
              <Route path="/logout" component={LogoutPage} />
              <Route path="/scan" />
              <Redirect to="/orders" />
            </Switch>
          </div>
        </FiltersProvider>
        <Footer />
      </ScrollContainer>
      <RouteDialog
        path={["/view/:model/:id/chat", "/:model/:id/chat"]}
        component={MessagesDialog}
        validParams={{ model: ["orders", "pickups", "transfers","returns"] }}
      />
      <RouteDialog
        path={["/view/:model/:id/history", "/:model/:id/history"]}
        component={EventsDialog}
        validParams={{ model: ["orders", "pickups", "transfers"] }}
      />
      <RouteDialog path="/cycles/:id/payments" component={PaymentsDialog} />
      <RouteDialog path="/scan" component={ScanPage} />
    </div>
  );
}
