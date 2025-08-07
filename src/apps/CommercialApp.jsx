import { Switch, Route, Redirect } from "react-router-dom";
import { Footer } from "../components/shared/Footer";
import { Header } from "../components/shared/Header";
import { Sidebar } from "../components/shared/Sidebar";
import { ScrollContainer } from "../components/shared/ScrollContainer";
import LogoutPage from "../pages/shared/Logout";
import { RouteDialog } from "../components/shared/RouteDialog";
import ClientsPage from "../pages/commercial/Clients";
import DashboardPage from "../pages/commercial/Dashboard";
import { EditClient } from "../components/commercial/EditClient";
import { EditDrawer } from "../components/shared/EditDrawer";
import { FiltersProvider } from "../components/shared/FiltersProvider";
import FetusesPage from "../pages/commercial/Fetuses";
import { MigratePack } from "../components/commercial/MigratePack";
import { LiveBanner } from "../components/shared/LiveBanner";
import { useStoreState } from "easy-peasy";

export default function CommercialApp() {
  const authUser = useStoreState((state) => state.auth.user);
  return (
    <div className="flex">
      <Sidebar />
      <ScrollContainer className="flex flex-1 flex-col h-screen overflow-auto">
        <LiveBanner />
        <Header />
        <FiltersProvider>
          <div className="flex-1">
            <Switch>
              <Route path="/clients" component={ClientsPage} />
              <Route path="/fetuses" component={FetusesPage} />
              {authUser.isMainUser && <Route path="/dashboard" component={DashboardPage} />}
              {/* <Route path={"/:model/:id"} component={SingleDocument} /> */}
              <Route path="/logout" component={LogoutPage} />
              <Redirect to="/clients" />
            </Switch>
          </div>
        </FiltersProvider>
        <Footer />
      </ScrollContainer>
      <RouteDialog
        path="/clients/:id/edit"
        component={EditDrawer}
        model="clients"
        EditView={EditClient}
      />
      <RouteDialog path="/clients/migrate-pack" component={MigratePack} />
    </div>
  );
}
