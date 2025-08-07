import { ScannerDropdown } from "./ScannerDropdown";
import { ClientDropdown } from "./ClientDropdown";
import { NotificationsDropdown } from "./NotificationsDropdown";

export const HeaderDropdowns = ({ role }) => {
  switch (role) {
    case "client":
      return (
        <>
          <ClientDropdown />
        </>
      );
    case "commercial":
      return <></>;
    case "tenant":
      return <></>;
    case "admin":
      return <></>;
    case "payman":
      return <></>;
    case "followup":
      return <></>;
    case "warehouse":
      return (
        <div className="flex gap-x-1">
          <NotificationsDropdown />
          <ScannerDropdown />
        </div>
      );
    case "deliverer":
      return (
        <>
          <ScannerDropdown />
        </>
      );
    default:
      return "Missing Header Dropdowns";
  }
};
