import { Fragment, useCallback, useEffect, useState, PureComponent } from "react";
import { useSkipFirstEffect } from "../../hooks/useSkipFirstEffect";
import { useToast } from "../../hooks/useToast";
import { useSnackbar } from "notistack";
import { useTranslation } from "../../i18n/provider";

export const InternetStatus = ({ children }) => {
  const [isOnline, setOnline] = useState(true);
  const { closeSnackbar } = useSnackbar();
  const showToast = useToast();
  const tl = useTranslation();
  useSkipFirstEffect(() => {
    if (isOnline) {
      console.log(`network is back online`);
      closeSnackbar("offline");
      showToast(tl("network_online"), "success", {
        anchorOrigin: { horizontal: "center", vertical: "top" },
      });
    } else {
      console.log(`network is now offline`);
      showToast(tl("network_offline"), "warning", {
        persist: true,
        anchorOrigin: { horizontal: "center", vertical: "top" },
        key: "offline",
      });
    }
  }, [isOnline]);

  const updateOnline = useCallback((value) => {
    console.log("called: ", value);
    setOnline(value);
  }, []);

  useEffect(() => {
    console.log("listening for network");
    window.addEventListener("online", () => updateOnline(true));
    window.addEventListener("offline", () => updateOnline(false));
    return () => {
      // no need to clean, would only unmount on app close
    };
  }, []);
  return (
    <Fragment>
      {/*  */}
      {children}
      {/*  */}
    </Fragment>
  );
};
