import { Switch, Route, Redirect } from "react-router-dom";
import { Footer } from "../components/shared/Footer";
import { Header } from "../components/shared/Header";
import { Sidebar } from "../components/shared/Sidebar";
import { ScrollContainer } from "../components/shared/ScrollContainer";
import LogoutPage from "../pages/shared/Logout";
import AccountPage from "../pages/tenant/Account";
import CyclesPage from "../pages/tenant/Cycles";
import { FiltersProvider } from "../components/shared/FiltersProvider";
import { LiveBanner } from "../components/shared/LiveBanner";
import { RouteDialog } from "../components/shared/RouteDialog";
import { PaymentsDialog } from "../components/shared/PaymentsDialog";

export default function TenantApp() {
  return (
    <div className="flex">
      <Sidebar />
      <ScrollContainer className="flex flex-1 flex-col h-screen overflow-auto">
        <LiveBanner />
        <Header />
        <FiltersProvider>
          <div className="flex-1">
            <Switch>
              <Route path="/cycles" component={CyclesPage} />

              <Route path="/account" component={AccountPage} />
              {/* <Route path={"/:model/:id"} component={SingleDocument} /> */}
              <Route path="/logout" component={LogoutPage} />
              <Redirect to="/account" />
            </Switch>
          </div>
        </FiltersProvider>
        <Footer />
      </ScrollContainer>
      <RouteDialog path="/cycles/:id/payments" component={PaymentsDialog} />
    </div>
  );
}
