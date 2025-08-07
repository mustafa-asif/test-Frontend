import { useLocation } from "react-router-dom";
import { Dialog } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import { useRouteQuery } from "../../hooks/useRouteQuery";
import { xFetch } from "../../utils/constants";
import { IconButton } from "./Button";
import { ErrorView } from "./ErrorView";
import { useGoBack } from "./LastLocation";
import { LoadingView } from "./LoadingView";
import { GroupPaymentsView, PaymentsView } from "./PaymentsView";

export const PaymentsDialog = ({ model, id, ...props }) => {
  const group = useRouteQuery("group");
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(null);
  const [cycle, setCycle] = useState(null);
  const fullScreen = useMediaQuery("(max-width:768px)");

  const location = useLocation();
  const isDelivererToWarehouseCycles = location.pathname.startsWith("/deliverers-cycles");
  const apiRoute = isDelivererToWarehouseCycles ? "/delivererToWarehouseCycles" : "/cycles";
  const route = isDelivererToWarehouseCycles ? "/deliverers-cycles" : "/cycles";
  const extraParams = isDelivererToWarehouseCycles ? ["show_deliverer_payments=true"] : [];

  const fetchCycle = async () => {
    setError(null);
    const { data, error } = await xFetch(`${apiRoute}/${id}`, undefined, undefined, undefined, [
      `_show=total pending payments`,
      ...extraParams,
    ]);
    setLoading(false);
    if (error) {
      return setError(error);
    }
    setCycle(data);
  };

  useEffect(() => {
    if (!props.open) {
      setLoading(true);
      setError(null);
    } else {
      fetchCycle();
    }
  }, [props.open]);

  const handleDrawerClose = useGoBack(route);

  const content = (() => {
    if (isLoading) return <LoadingView />;
    if (!cycle) return <ErrorView text={isError || "could not find cycle"} />;
    if (group) {
      return (
        <GroupPaymentsView
          _id={id}
          group={group}
          cycle={cycle}
          handleDrawerClose={handleDrawerClose}
        />
      );
    }
    return <PaymentsView _id={id} cycle={cycle} handleDrawerClose={handleDrawerClose} />;
  })();

  return (
    <Dialog {...props} onClose={handleDrawerClose} fullScreen={fullScreen}>
      <IconButton
        icon="times"
        onClick={handleDrawerClose}
        className="absolute right-5 top-3 md:hidden z-40 text-gray-800"
        iconColor="gray"
      />
      {content}
    </Dialog>
  );
};
