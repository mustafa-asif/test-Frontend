import { Switch, Route, Redirect } from "react-router-dom";
import { Footer } from "../components/shared/Footer";
import { Header } from "../components/shared/Header";
import { Sidebar } from "../components/shared/Sidebar";
import { ScrollContainer } from "../components/shared/ScrollContainer";
import OrdersPage from "../pages/followup/Orders";
import PickupsPage from "../pages/followup/Pickups";
import TransfersPage from "../pages/followup/Transfers";
import ClientsPage from "../pages/followup/Clients";
import DashboardPage from "../pages/followup/Dashboard";
import LogoutPage from "../pages/shared/Logout";
import DebugPage from "../pages/followup/Debug";
import ReclamationsPage from "../pages/followup/Reclamations";
import WarehousesPage from "../pages/followup/Warehouses";
import ReturnsPage from "../pages/followup/Returns";
import ProductsPage from "../pages/followup/Products";
import SingleDocument from "../pages/followup/SingleDocument";
import { RouteDialog } from "../components/shared/RouteDialog";
import { MessagesDialog } from "../components/shared/MessagesDialog";
import { EventsDialog } from "../components/shared/EventsDialog";
import { EditOrder } from "../components/followup/EditOrder";
import { EditDrawer } from "../components/shared/EditDrawer";
import { EditPickup } from "../components/shared/EditPickup";
import { FiltersProvider } from "../components/shared/FiltersProvider";
import { WarehouseOptions } from "../components/followup/WarehouseOptions";
import { EditClient } from "../components/followup/EditClient";
import { LiveBanner } from "../components/shared/LiveBanner";
import { useStoreState } from "easy-peasy";
import { LockedItems } from "../components/followup/LockedItems";
import { EditWarehouse } from "../components/followup/EditWarehouse";
import { useAccessRestrictions } from "../hooks/useAccessRestrictions";
import { AddReturn } from "../components/followup/AddReturn";
import { AddItems } from "../components/followup/AddItems";

export default function FollowupApp() {
  const authUser = useStoreState((state) => state.auth.user);
  const { canAccessPage } = useAccessRestrictions();

  return (
    <div className="flex">
      <Sidebar />
      <ScrollContainer className="flex flex-1 flex-col h-screen overflow-auto">
        <LiveBanner />
        <Header />
        <FiltersProvider>
          <LockedItems>
            <WarehouseOptions>
              <div className="flex-1">
                <Switch>
                  <Route path="/orders" component={OrdersPage} />
                  <Route path="/pickups" component={PickupsPage} />
                  <Route path="/transfers" component={TransfersPage} />
                  <Route path="/clients" component={ClientsPage} />
                  <Route path="/tickets" component={ReclamationsPage} />
                  {canAccessPage("/warehouses") && (
                    <Route path="/warehouses" component={WarehousesPage} />
                  )}
                  {canAccessPage("purges") && <Route path="/returns" component={ReturnsPage} />}
                  {canAccessPage("products") && <Route path="/products" component={ProductsPage} />}

                  <Route path="/debug" component={DebugPage} />
                  {authUser.isMainUser && <Route path="/dashboard" component={DashboardPage} />}
                  <Route path={"/view/:model/:id"} component={SingleDocument} />
                  <Route path="/logout" component={LogoutPage} />
                  <Redirect to="/orders" />
                </Switch>
              </div>
            </WarehouseOptions>
          </LockedItems>
        </FiltersProvider>
        <Footer />
      </ScrollContainer>
      <RouteDialog
        path="/:model/:id/chat"
        component={MessagesDialog}
        validParams={{ model: ["orders", "pickups", "transfers", "tickets", "returns"] }}
      />
      <RouteDialog
        path="/:model/:id/history"
        component={EventsDialog}
        validParams={{ model: ["orders", "pickups", "transfers", "tickets"] }}
      />
      <RouteDialog path="/returns/add" component={AddReturn} />
      <RouteDialog path="/products/add" component={AddItems} />


      {canAccessPage("/warehouses") && (
        <RouteDialog
          path="/warehouses/:id/edit"
          component={EditDrawer}
          model="warehouses"
          EditView={EditWarehouse}
          width="w-screen sm:w-screen/1.5"
        />
      )}
      <RouteDialog
        path="/orders/:id/edit"
        component={EditDrawer}
        model="orders"
        EditView={EditOrder}
      />
      <RouteDialog
        path="/pickups/:id/edit"
        component={EditDrawer}
        model="pickups"
        EditView={EditPickup}
      />
      <RouteDialog
        path="/clients/:id/edit"
        component={EditDrawer}
        model="clients"
        EditView={EditClient}
      />
    </div>
  );
}
