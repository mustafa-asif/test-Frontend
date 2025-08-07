import { Switch, Route, Redirect } from "react-router-dom";
import { Footer } from "../components/shared/Footer";
import { Header } from "../components/shared/Header";
import { Sidebar } from "../components/shared/Sidebar";
import { ScrollContainer } from "../components/shared/ScrollContainer";
import OrdersPage from "../pages/warehouse/Orders";
import PickupsPage from "../pages/warehouse/Pickups";
import ProductsPage from "../pages/warehouse/Products";
import LogoutPage from "../pages/shared/Logout";
import TransfersPage from "../pages/warehouse/Transfers";
import ContainersPage from "../pages/warehouse/Containers";
import ReturnsPage from "../pages/warehouse/Returns";
import CyclesPage from "../pages/warehouse/Cycles";
import DelivererCyclesPage from "../pages/warehouse/DelivererCycles";
import DeliverersPage from "../pages/warehouse/Deliverers";
import InvoicesPage from "../pages/warehouse/Invoices";
import AccountPage from "../pages/warehouse/Account";
import SingleDocument from "../pages/warehouse/SingleDocument";
import DashboardPage from "../pages/warehouse/Dashboard";
import { RouteDialog } from "../components/shared/RouteDialog";
import { MessagesDialog } from "../components/shared/MessagesDialog";
import { EventsDialog } from "../components/shared/EventsDialog";
import { PaymentsDialog } from "../components/shared/PaymentsDialog";
import { AddItems } from "../components/warehouse/AddItems";
import { AddPickup } from "../components/warehouse/AddPickup";
import { AddReturn } from "../components/warehouse/AddReturn";
import { AddInvoice } from "../components/warehouse/AddInvoice";
import { AddDeliverer } from "../components/warehouse/AddDeliverer";
import { EditDeliverer } from "../components/warehouse/EditDeliverer";
import { EditDrawer } from "../components/shared/EditDrawer";
import ScanPage from "../pages/shared/Scan";
import { EditPickup } from "../components/shared/EditPickup";
import { FiltersProvider } from "../components/shared/FiltersProvider";
import { DelivererOptions } from "../components/warehouse/DelivererOptions";
import { LiveBanner } from "../components/shared/LiveBanner";
import { PrintOrders } from "../components/shared/PrintOrders";
import { useAccessRestrictions } from "../hooks/useAccessRestrictions";

export default function WarehouseApp() {
  const { canAccessPage } = useAccessRestrictions();
  return (
    <div className="flex">
      <Sidebar />
      <ScrollContainer className="flex flex-1 flex-col h-screen overflow-auto">
        <LiveBanner />
        <Header />
        <FiltersProvider>
          <DelivererOptions>
            <PrintOrders>
              <div className="flex-1">
                <Switch>
                  {canAccessPage("orders") && <Route path="/orders" component={OrdersPage} />}

                  {canAccessPage("pickups") && <Route path="/pickups" component={PickupsPage} />}
                  {canAccessPage("transfers") && (
                    <Route path="/transfers" component={TransfersPage} />
                  )}
                  {canAccessPage("purges") && <Route path="/returns" component={ReturnsPage} />}
                  {canAccessPage("deliverers") && (
                    <Route path="/deliverers" component={DeliverersPage} />
                  )}
                  {canAccessPage("deliverers") && (
                    <Route path="/deliverers-cycles" component={DelivererCyclesPage} />
                  )}
                  {canAccessPage("containers") && (
                    <Route path="/containers" component={ContainersPage} />
                  )}
                  {canAccessPage("cycles") && <Route path="/cycles" component={CyclesPage} />}
                  {canAccessPage("invoices") && <Route path="/invoices" component={InvoicesPage} />}
                  {canAccessPage("products") && <Route path="/products" component={ProductsPage} />}
                  {canAccessPage("account") && <Route path="/account" component={AccountPage} />}
                  <Route path="/logout" component={LogoutPage} />
                  {/* <Route path="/dashboard" component={DashboardPage} /> */}
                  <Route path={"/view/:model/:id"} component={SingleDocument} />
                  <Route path="/scan" />
                  {canAccessPage("orders") && <Redirect to="/orders" />}
                </Switch>
              </div>
            </PrintOrders>
          </DelivererOptions>
        </FiltersProvider>
        <Footer />
      </ScrollContainer>
      <RouteDialog
        path={["/view/:model/:id/chat", "/:model/:id/chat"]}
        component={MessagesDialog}
        validParams={{ model: ["containers", "orders", "pickups", "transfers","returns"] }}
      />
      <RouteDialog
        path={["/view/:model/:id/history", "/:model/:id/history"]}
        component={EventsDialog}
        validParams={{ model: ["containers", "items", "orders", "pickups", "transfers"] }}
      />
      <RouteDialog path="/cycles/:id/payments" component={PaymentsDialog} />
      <RouteDialog path="/deliverers-cycles/:id/payments" component={PaymentsDialog} />
      <RouteDialog path="/products/add" component={AddItems} />
      <RouteDialog path="/pickups/add" component={AddPickup} />
      <RouteDialog path="/returns/add" component={AddReturn} />
      <RouteDialog path="/invoices/add" component={AddInvoice} />
      <RouteDialog path="/deliverers/add" component={AddDeliverer} />
      <RouteDialog
        path="/deliverers/:id/edit"
        component={EditDrawer}
        model="deliverers"
        EditView={EditDeliverer}
      />
      <RouteDialog
        path="/pickups/:id/edit"
        component={EditDrawer}
        model="pickups"
        EditView={EditPickup}
      />
      <RouteDialog path="/scan" component={ScanPage} />
    </div>
  );
}
