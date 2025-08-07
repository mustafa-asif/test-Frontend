import { useStoreState } from "easy-peasy";
import { Switch, Route, Redirect } from "react-router-dom";
import { Footer } from "../components/shared/Footer";
import { Header } from "../components/shared/Header";
import { Sidebar } from "../components/shared/Sidebar";
import { ScrollContainer } from "../components/shared/ScrollContainer";
import SingleDocument from "../pages/client/SingleDocument";
import DashboardPage from "../pages/client/Dashboard2";
import ReferralsPage from "../pages/client/Referrals";
import OrdersPage from "../pages/client/Orders";
import PickupsPage from "../pages/client/Pickups";
import TransfersPage from "../pages/client/Transfers";
import CyclesPage from "../pages/client/Cycles";
import SettingsPage from "../pages/client/Settings";
import ProductsPage from "../pages/client/Products";
import LogoutPage from "../pages/shared/Logout";
import SearchPage from "../pages/shared/Search";
import { RouteDialog } from "../components/shared/RouteDialog";
import { AddOrder } from "../components/client/AddOrder";
import { EditDrawer } from "../components/shared/EditDrawer";
import { EditOrder } from "../components/client/EditOrder";
import { MessagesDialog } from "../components/shared/MessagesDialog";
import { EventsDialog } from "../components/shared/EventsDialog";
import { PaymentsDialog } from "../components/shared/PaymentsDialog";
import { ReservedItemsDialog } from "../components/client/ReservedItemsDialog";
import { AddPickup } from "../components/client/AddPickup";
import { AddTransfer } from "../components/client/AddTransfer";
import { AddItems } from "../components/client/AddItems";
import { EditPickup } from "../components/shared/EditPickup";
import { FiltersProvider } from "../components/shared/FiltersProvider";
import { LiveBanner } from "../components/shared/LiveBanner";
import { PrintOrders } from "../components/shared/PrintOrders";
import { ReplaceOrder } from "../components/client/ReplaceOrder";
import { AddReturn } from "../components/client/AddReturn";
import AutoSmsPage from "../pages/client/AutoSms";
import ReturnsPage from "../pages/client/Returns";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";
import ChatPopup from "../components/client/ChatPopup";

export default function ClientApp() {
  const user = useStoreState((state) => state.auth.user);
  const brandName = useStoreState((state) => state.auth.user?.client?.brand.name).trim();
  const pack = useStoreState((state) => state.auth.user?.client?.pack);
  const smsEnabled = useStoreState((state) => state.auth.user.client.sms?.enabled);

  const posthog = usePostHog();

  useEffect(() => {
    if (user && posthog) {
      posthog.identify(user._id, {
        email: user.email,
        phone: user.phone,
      });
    }
  }, [user?._id]);

  return (
    <div className="flex">
      {brandName && <Sidebar />}
      <ScrollContainer className="flex flex-1 flex-col h-screen overflow-auto">
        <LiveBanner />
        <Header />
        <FiltersProvider>
          <PrintOrders>
            <div className="flex-1">
              {/* flex flex-col */}
              {brandName ? (
                <Switch>
                  <Route path="/orders" component={OrdersPage} />
                  <Route path="/pickups" component={PickupsPage} />
                  {pack?.startsWith("stockage") && (
                    <Route path="/transfers" component={TransfersPage} />
                  )}
                  <Route path="/products" component={ProductsPage} />

                  <Route path="/dashboard" component={DashboardPage} />
                  {user.isMainUser && user.client.referral?.enabled && (
                    <Route path="/referrals" component={ReferralsPage} />
                  )}
                  {user.isMainUser && <Route path="/cycles" component={CyclesPage} />}
                  {user.isMainUser && <Route path="/returns" component={ReturnsPage} />}

                  <Route path={"/view/:model/:id"} component={SingleDocument} />
                  <Route path="/search" component={SearchPage} />
                  <Route path="/account" component={SettingsPage} />
                  <Route path="/logout" component={LogoutPage} />
                  {smsEnabled && <Route path="/auto-sms" component={AutoSmsPage} />}

                  <Redirect to="/orders" />
                </Switch>
              ) : (
                <Switch>
                  {user.isMainUser && <Route path="/account" component={SettingsPage} />}
                  <Route path="/logout" component={LogoutPage} />
                  <Redirect to="/account" />
                </Switch>
              )}
            </div>
          </PrintOrders>
        </FiltersProvider>
        <Footer />
        <ChatPopup />
      </ScrollContainer>
      <RouteDialog
        path={["/view/:model/:id/chat", "/:model/:id/chat"]}
        component={MessagesDialog}
        validParams={{ model: ["orders", "pickups", "transfers", "tickets", "returns"] }}
      />
      <RouteDialog
        path={["/view/:model/:id/history", "/:model/:id/history"]}
        component={EventsDialog}
        validParams={{ model: ["orders", "pickups", "transfers", "tickets"] }}
      />
      <RouteDialog path="/cycles/:id/payments" component={PaymentsDialog} />
      <RouteDialog path="/orders/add" component={AddOrder} />
      <RouteDialog path="/pickups/add" component={AddPickup} />
      <RouteDialog path="/transfers/add" component={AddTransfer} />
      <RouteDialog path="/products/add" component={AddItems} />
      <RouteDialog path="/returns/add" component={AddReturn} />

      <RouteDialog path="/products/:id/reserved" component={ReservedItemsDialog} />
      <RouteDialog
        path={["/view/:model/:id/edit", "/:model/:id/edit"]}
        component={EditDrawer}
        model="orders"
        EditView={EditOrder}
      />
      <RouteDialog
        path={["/view/orders/:id/replace", "/orders/:id/replace"]}
        component={EditDrawer}
        model="orders"
        EditView={ReplaceOrder}
      />
      <RouteDialog
        path="/pickups/:id/edit"
        component={EditDrawer}
        model="pickups"
        EditView={EditPickup}
      />
    </div>
  );
}
