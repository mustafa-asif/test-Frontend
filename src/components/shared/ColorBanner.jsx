import { useStoreState } from "easy-peasy";
import { cl, getBgColor } from "../../utils/misc";

export const ColorBanner = ({ className, style, ...props }) => {
  const userRole = useStoreState((state) => state.auth.user?.role);
  return (
    <div
      className={cl(
        "absolute left-0 right-0",
        { "bg-primary": userRole === "client" },
        { [`${getBgColor(userRole)}`]: userRole !== "client" },
        className
      )}
      style={{ top: -600, bottom: -100, zIndex: -1, ...style }}>
      <div className="banner-overlay"></div>
    </div>
  );
};
