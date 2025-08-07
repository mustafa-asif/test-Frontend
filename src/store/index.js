import { createStore } from "easy-peasy";
import { authModel } from "./models/auth";
import { citiesModel } from "./models/cities";
import { cyclesModel } from "./models/cycles";
import { dashboardModel } from "./models/dashboard";
import { ordersModel } from "./models/orders";
import { pickupsModel } from "./models/pickups";
import { productsModel } from "./models/products";
import { transfersModel } from "./models/transfers";
import { ticketsModel } from "./models/tickets";
import { containersModel } from "./models/containers";
import { purgesModel } from "./models/purges";
import { invoicesModel } from "./models/invoices";
import { deliverersModel } from "./models/deliverers";
import { clientCyclesModel } from "./models/clientCycles";
import { warehouseCyclesModel } from "./models/warehouseCycles";
import { feesModel } from "./models/fees";
import { warehousesModel } from "./models/warehouses";
import { shippersModel } from "./models/shippers";
import { clientsModel } from "./models/clients";
import { snapshotsModel } from "./models/snapshots";
import { referralsModel } from "./models/referrals";
import { runsModel } from "./models/runs";
import { fetusesModel } from "./models/fetuses";
import { usersModel } from "./models/users";
import { documentsModel } from "./models/documents";
import { notificationsModel } from "./models/notifications";
import { bannersModel } from "./models/banners";
import { tenantCyclesModel } from "./models/tenantCycles";
import { SupportCategoryModel } from "./models/supportCategories";
import { AutoMessageModel } from "./models/autoMessages";
import { delivererToWarehouseCyclesModel } from "./models/delivererToWarehouseCycles";
import { systemEventsModel } from "./models/systemEvents";

const store = createStore({
  auth: authModel,
  cities: citiesModel,
  dashboard: dashboardModel,
  // items: itemsModel,
  orders: ordersModel, // documentsModel
  pickups: pickupsModel, // documentsModel
  products: productsModel,
  transfers: transfersModel, // documentsModel
  tickets: ticketsModel, // documentsModel
  containers: containersModel, // documentsModel
  purges: purgesModel, // documentsModel
  invoices: invoicesModel,
  deliverers: deliverersModel,
  cycles: cyclesModel,
  clientCycles: clientCyclesModel,
  tenantCycles: tenantCyclesModel,
  warehouseCycles: warehouseCyclesModel,
  fees: feesModel,
  warehouses: warehousesModel,
  shippers: shippersModel,
  clients: clientsModel,
  snapshots: snapshotsModel,
  referrals: referralsModel,
  runs: runsModel,
  fetuses: fetusesModel,
  users: usersModel,
  banners: bannersModel,
  supportCategories: SupportCategoryModel,
  autoMessages: AutoMessageModel,
  notifications: notificationsModel,
  autosms: documentsModel,
  delivererToWarehouseCycles: delivererToWarehouseCyclesModel,
  systemEvents: systemEventsModel,
});

export default store;
