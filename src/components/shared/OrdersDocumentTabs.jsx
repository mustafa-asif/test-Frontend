import { Tab, Tabs } from "@mui/material";
import { translateStatus } from "../../utils/misc";
import { getColorConf, getIconConf } from "../../utils/styles";
import { useStoreState } from "easy-peasy";

const roleStatuses = {
  warehouse: ["all", "returned-pending", "pending", "in progress", "problem"],
};

export const OrdersDocumentTab = ({ currentStatus, setCurrentStatus }) => {
  const role = useStoreState((state) => state.auth.user.role);

  const statuses = roleStatuses[role];

  return (
    <Tabs
      className="bg-white rounded-lg shadow-md"
      value={currentStatus}
      onChange={(e, newStatus) => setCurrentStatus(newStatus)}
      variant="scrollable"
      scrollButtons={true}
      aria-label="scrollable auto tabs example">
      {statuses.map((status) => (
        <Tab
          icon={
            <i
              className={`fas ${getIconConf("orders", status)} text-${getColorConf(
                "orders",
                status
              )} text-xl`}></i>
          }
          key={status}
          label={translateStatus("orders", status)}
          value={status}
          disableRipple
        />
      ))}
    </Tabs>
  );
};
