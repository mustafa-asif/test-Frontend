import { Switch, Route, Redirect } from "react-router-dom";
import { Footer } from "../components/shared/Footer";
import { Header } from "../components/shared/Header";
import { Sidebar } from "../components/shared/Sidebar";
import { ScrollContainer } from "../components/shared/ScrollContainer";
import PaymentsPage from "../pages/admin/Payments";
import FeesPage from "../pages/admin/Fees";
import CitiesPage from "../pages/admin/Cities";
import LogoutPage from "../pages/shared/Logout";
import SingleDocument from "../pages/followup/SingleDocument";
import { RouteDialog } from "../components/shared/RouteDialog";
import { PaymentsDialog } from "../components/shared/PaymentsDialog";
import { EditDrawer } from "../components/shared/EditDrawer";
import { AddPayment } from "../components/admin/AddPayment";
import { AddFees } from "../components/admin/AddFees";
import { EditFees } from "../components/admin/EditFees";
import WarehousesPage from "../pages/admin/Warehouses";
import ShippersPage from "../pages/admin/Shippers";
import SnapshotsPage from "../pages/admin/Snapshots";
import RunsPage from "../pages/admin/Runs";
import UsersPage from "../pages/admin/Users";
import DashboardPage from "../pages/admin/Dashboard2";
import BannersPage from "../pages/admin/Banners";
import ClientsPage from "../pages/admin/Clients";
import AutoSmsPage from "../pages/admin/AutoSms";
import { AddWarehouse } from "../components/admin/AddWarehouse";
import { EditWarehouse } from "../components/admin/EditWarehouse";
import { AddShipper } from "../components/admin/AddShipper";
import { EditShipper } from "../components/admin/EditShipper";
import { AddSnapshot } from "../components/admin/AddSnapshot";
import { MigratePack } from "../components/admin/MigratePack";
import { EditClient } from "../components/admin/EditClient";
import { EditUser } from "../components/admin/EditUser";
import { AddUser } from "../components/admin/AddUser";
import { AddBanner } from "../components/admin/AddBanner";
import { EditBanner } from "../components/admin/EditBanner";
import { LiveBanner } from "../components/shared/LiveBanner";
import { AddSupportCategory } from "../components/admin/AddSupportCategory";
import SupportCategories from "../pages/admin/SupportCategories";
import { EditSupportCategory } from "../components/admin/EditSupportCategory";
import { EditAutoMessage } from "../components/admin/EditAutoMessage";
import { AddAutoMessage } from "../components/admin/AddAutoMessage";
import AutoMessages from "../pages/admin/AutoMessages";
import SystemEventsPage from "../pages/admin/SystemEvents";

export default function AdminApp() {
  return (
    <div className="flex">
      <Sidebar />
      <ScrollContainer className="flex flex-1 flex-col h-screen overflow-auto">
        <LiveBanner />
        <Header />
        <div className="flex-1">
          <Switch>
            <Route path="/dashboard" component={DashboardPage} />
            <Route path="/payments" component={PaymentsPage} />
            <Route path="/fees" component={FeesPage} />
            <Route path="/cities" component={CitiesPage} />
            <Route path="/warehouses" component={WarehousesPage} />
            <Route path="/clients" component={ClientsPage} />
            <Route path="/shippers" component={ShippersPage} />
            <Route path="/runs" component={RunsPage} />
            <Route path="/snapshots" component={SnapshotsPage} />
            <Route path="/users" component={UsersPage} />
            <Route path="/banners" component={BannersPage} />
            <Route path="/support-categories" component={SupportCategories} />
            <Route path="/auto-messages" component={AutoMessages} />
            <Route path="/auto-sms" component={AutoSmsPage} />
            <Route path="/system-events" component={SystemEventsPage} />
            <Route path={"/view/:model/:id"} component={SingleDocument} />
            <Route path="/logout" component={LogoutPage} />
            <Redirect to="/users" />
          </Switch>
        </div>
        <Footer />
      </ScrollContainer>
      <RouteDialog path="/payments/add" component={AddPayment} />
      <RouteDialog path="/warehouses/add" component={AddWarehouse} />
      <RouteDialog path="/shippers/add" component={AddShipper} />
      <RouteDialog path="/fees/add" component={AddFees} />
      <RouteDialog path="/snapshots/add" component={AddSnapshot} />
      <RouteDialog path="/users/add" component={AddUser} />
      <RouteDialog path="/banners/add" component={AddBanner} />
      <RouteDialog path="/support-categories/add" component={AddSupportCategory} />
      <RouteDialog path="/auto-messages/add" component={AddAutoMessage} />
      <RouteDialog path="/cycles/:id/payments" component={PaymentsDialog} />
      <RouteDialog
        path="/fees/:id/edit"
        component={EditDrawer}
        model="fees"
        EditView={EditFees}
        width="w-screen sm:w-screen/1.5"
      />
      <RouteDialog
        path="/warehouses/:id/edit"
        component={EditDrawer}
        model="warehouses"
        EditView={EditWarehouse}
        width="w-screen sm:w-screen/1.5"
      />
      <RouteDialog
        path="/shippers/:id/edit"
        component={EditDrawer}
        model="shippers"
        EditView={EditShipper}
        width="w-screen sm:w-screen/1.5"
      />
      <RouteDialog
        path="/clients/:id/edit"
        component={EditDrawer}
        model="clients"
        EditView={EditClient}
      />
      <RouteDialog
        path="/users/:id/edit"
        component={EditDrawer}
        model="users"
        EditView={EditUser}
      />
      <RouteDialog
        path="/banners/:id/edit"
        component={EditDrawer}
        model="banners"
        EditView={EditBanner}
      />
      <RouteDialog
        path="/support-categories/:id/edit"
        mainPagePath="support-categories"
        component={EditDrawer}
        model="supportCategories"
        EditView={EditSupportCategory}
      />
      <RouteDialog
        path="/auto-messages/:id/edit"
        mainPagePath="auto-messages"
        component={EditDrawer}
        model="autoMessages"
        EditView={EditAutoMessage}
      />
      <RouteDialog path="/clients/migrate-pack" component={MigratePack} />
    </div>
  );
}
