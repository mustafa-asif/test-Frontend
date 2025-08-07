import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.css";
import LoginPage from "./pages/shared/Login";
import RegisterPage from "./pages/shared/Register";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { xGetCities } from "./utils/cities";
import { useStoreActions, useStoreState } from "easy-peasy";
import { xState } from "./utils/auth";
import { cl } from "./utils/misc";
import { SocketProvider } from "./components/shared/SocketProvider";
import { useLastReferrer } from "./hooks/useLastReferrer";
import { MAINTENANCE_MODE } from "./utils/constants";
import MaintenancePage from "./pages/shared/Maintenance";
import { isTenant, secondaryColor } from "./tenant-config";
import { PostHogProvider } from "posthog-js/react";

// import ReactGA from "react-ga";

// ReactGA.initialize("UA-196653418-1");

// bug with the DocumentsManager comp not update the documents.length
function App() {
  const setCities = useStoreActions((actions) => actions.cities.setCities);
  const setAuth = useStoreActions((actions) => actions.auth.setAuth);
  const { user, loading } = useStoreState((state) => state.auth);

  useEffect(() => {
    console.log("user changed");
  }, [user]);

  useEffect(() => {
    updateCities().finally(updateAuth);
  }, []);

  async function updateCities() {
    const { data, error } = await xGetCities();
    if (data) setCities({ cities: data });
  }

  async function updateAuth() {
    const { data, error } = await xState();
    setAuth({ user: data });
  }
  if (MAINTENANCE_MODE) return <MaintenanceApp />;
  if (loading) return <LoadingApp />;
  if (user)
    return (
      <SocketProvider>
        <UserApp role={user.role} />
      </SocketProvider>
    );

  return <GuestApp />;
}

const GuestApp = () => {
  useLastReferrer();
  return (
    <div
      className={cl(
        "flex flex-1 items-center justify-center min-w-screen min-h-screen bg-background"
      )}
      style={{
        backgroundImage: isTenant ? undefined : "url(/img/bg.png)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100%",
      }}>
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        {/* <Route path="/testing" component={TestingPage} /> */}
        <Redirect to="/login" />
      </Switch>
    </div>
  );
};

const LoadingApp = () => {
  return (
    <div
      className={cl("flex items-center h-full min-h-screen font-sans bg-background ")}
      style={{
        backgroundImage: isTenant ? undefined : "url(/img/bg.png)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100%",
      }}>
      <div className="rounded-full border-8 border-t-8 border-white h-12 w-12 animate-spin m-auto border-t-secondary"></div>
    </div>
  );
};

const MaintenanceApp = () => {
  return (
    <div
      className={cl("flex items-center h-full min-h-screen font-sans bg-background")}
      style={{
        backgroundImage: isTenant ? undefined : "url(/img/bg.png)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100%",
      }}>
      <MaintenancePage />
    </div>
  );
};

const UserApp = ({ role }) => {
  const ClientApp = lazy(() => import("./apps/ClientApp"));
  const FollowupApp = lazy(() => import("./apps/FollowupApp"));
  const WarehouseApp = lazy(() => import("./apps/WarehouseApp"));
  const DelivererApp = lazy(() => import("./apps/DelivererApp"));
  const PaymanApp = lazy(() => import("./apps/PaymanApp"));
  const AdminApp = lazy(() => import("./apps/AdminApp"));
  const CommercialApp = lazy(() => import("./apps/CommercialApp"));
  const TenantApp = lazy(() => import("./apps/TenantApp"));

  return (
    <Suspense fallback={<LoadingApp />}>
      {(() => {
        if (role === "client") {
          if (process.env.REACT_APP_PUBLIC_POSTHOG_KEY) {
            return (
              <PostHogProvider
                apiKey={process.env.REACT_APP_PUBLIC_POSTHOG_KEY}
                options={{ api_host: process.env.REACT_APP_PUBLIC_POSTHOG_HOST }}>
                <ClientApp />
              </PostHogProvider>
            );
          } else {
            return <ClientApp />;
          }
        }

        if (role === "followup") {
          return <FollowupApp />;
        }

        if (role === "warehouse") {
          return <WarehouseApp />;
        }

        if (role === "deliverer") {
          return <DelivererApp />;
        }

        if (role === "payman") {
          return <PaymanApp />;
        }

        if (role === "admin") {
          return <AdminApp />;
        }

        if (role === "commercial") {
          return <CommercialApp />;
        }

        if (role === "tenant") {
          return <TenantApp />;
        }

        return (
          <div>
            <h1>no app for user: {role}</h1>
          </div>
        );
      })()}
    </Suspense>
  );
};

// export default withRouter(App);
export default App;
