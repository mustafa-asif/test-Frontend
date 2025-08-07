import { Link, useLocation } from "react-router-dom";
import { IconButton } from "./Button";

export const ScannerDropdown = () => {
  const location = useLocation();
  const model = location.pathname.split('/')[1];

  return (
    <Link
      to={(location) => ({
        pathname: "/scan",
        state: {
          prevPath: location.pathname,
          model: model
        },
      })}>
      <IconButton icon="qrcode" />
    </Link>
  );
};
