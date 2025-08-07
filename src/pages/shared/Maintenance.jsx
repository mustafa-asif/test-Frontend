import { MAINTENANCE_START } from "../../utils/constants";
import { Link } from "react-router-dom";
import { useTranslation } from "../../i18n/provider";
import { brandLogo } from "../../tenant-config";

export default function MaintenancePage() {
  const tl = useTranslation();

  return (
    <div
      className="max-w-sm mx-auto bg-white rounded-lg shadow-lg lg:max-w-4xl px-6 py-8 md:px-8 lg:w-1/2"
      style={{
        boxShadow:
          "0px 0px 30px rgba(16, 185, 129, 0.1), inset 0 -10px 15px 0 rgba(16, 185, 129, 0.2)",
      }}>
      <Link to="/">
        <img className="mx-auto pb-5 w-32" src={brandLogo} alt="" />
      </Link>

      <div className="flex items-center justify-center gap-x-2 mb-3">
        <i class="text-xl md:text-2xl fas fa-wrench"></i>
        <h1 className="text-lg md:text-xl text-center font-semibold text-gray-700 capitalize">
          {"Système en cours de maintenance"}
        </h1>
        <i class="text-xl md:text-2xl fas fa-wrench"></i>
      </div>

      <p className="text-gray-400 text-center">L'accès devrait être rétabli d'ici quelques heures. 
Merci pour votre patience.</p>
      {MAINTENANCE_START && (
        <p className="text-gray-400 text-center">
          Start time <b>{MAINTENANCE_START}</b>
        </p>
      )}
        {window.location.hostname.includes("livo.ma") && (
          <a href="https://wa.me/212675222777" className="float" target="_blank">
            <i className="fab fa-whatsapp my-float"></i>
          </a>
        )}
    </div>
  );
}
