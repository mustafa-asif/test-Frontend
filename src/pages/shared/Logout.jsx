import { useEffect } from "react";
import { xLogout } from "../../utils/auth";
import { isTenant } from "../../tenant-config";
import { cl } from "../../utils/misc";

export default function LogoutPage() {
  useEffect(() => {
    logout();
  }, []);

  async function logout() {
    await xLogout();
    window.location.reload();
  }

  return (
    <div
      className={cl("flex items-center h-full min-h-screen bg-background")}
      style={{
        backgroundImage: isTenant ? undefined : "url(/img/bg.png)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100%",
        marginTop: -100,
      }}>
      <div className="rounded-full border-8 border-t-8 border-white h-12 w-12 animate-spin m-auto border-t-secondary"></div>
    </div>
  );
}
