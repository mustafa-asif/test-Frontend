import { Switch, Route, Redirect } from "react-router-dom";
import { Footer } from "../components/shared/Footer";
import { Header } from "../components/shared/Header";
import { Sidebar } from "../components/shared/Sidebar";
import { ScrollContainer } from "../components/shared/ScrollContainer";
// import CyclesPage from "../pages/payman/Cycles";
import PaymentsPage from "../pages/payman/Payments";
import LogoutPage from "../pages/shared/Logout";
import SingleDocument from "../pages/followup/SingleDocument";
import { RouteDialog } from "../components/shared/RouteDialog";
import { PaymentsDialog } from "../components/shared/PaymentsDialog";
import ClientCyclesPage from "../pages/payman/ClientCycles";
import WarehouseCyclesPage from "../pages/payman/WarehouseCycles";
import { FiltersProvider } from "../components/shared/FiltersProvider";
import { AddPayment } from "../components/admin/AddPayment";
import { LiveBanner } from "../components/shared/LiveBanner";
import TenantCyclesPage from "../pages/payman/TenantCycles";
import { useAccessRestrictions } from "../hooks/useAccessRestrictions";

export default function PaymanApp() {
  const { canAccessPage } = useAccessRestrictions();
  return (
    <div className="flex">
      <Sidebar />
      <ScrollContainer className="flex flex-1 flex-col h-screen overflow-auto">
        <LiveBanner />
        <Header />
        <FiltersProvider>
          <div className="flex-1">
            <Switch>
              {canAccessPage("payments") && <Route path="/payments" component={PaymentsPage} />}
              {canAccessPage("client-cycles") && <Route path="/client-cycles" component={ClientCyclesPage} />}
              {canAccessPage("warehouse-cycles") && <Route path="/warehouse-cycles" component={WarehouseCyclesPage} />}
              {canAccessPage("tenant-cycles") && <Route path="/tenant-cycles" component={TenantCyclesPage} />}
              <Route path={"/view/:model/:id"} component={SingleDocument} />
              <Route path="/logout" component={LogoutPage} />
              {canAccessPage("payments") && <Redirect to="/payments" />}
            </Switch>
          </div>
        </FiltersProvider>
        <Footer />
      </ScrollContainer>
      <RouteDialog path="/client-cycles/:id/payments" component={PaymentsDialog} />
      <RouteDialog path="/tenant-cycles/:id/payments" component={PaymentsDialog} />
      <RouteDialog path="/warehouse-cycles/:id/payments" component={PaymentsDialog} />
      <RouteDialog path="/payments/add" component={AddPayment} />
    </div>
  );
}
