import { Fragment } from "react";
import { useStoreState } from "easy-peasy";
import { SettingsCard } from "../../components/client/SettingsCard";
import { TeamCard } from "../../components/client/TeamCard";
import { ApiCard } from "../../components/shared/ApiCard";
import { ColorBanner } from "../../components/shared/ColorBanner";

export default function SettingsPage() {
  const user = useStoreState(state => state.auth.user);
  const brandName = user?.client?.brand.name.trim();
  return (
    <Fragment>
      <div className="relative pb-32" style={{ marginTop: -65, paddingTop: 75 }}>
        <ColorBanner />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 w-full px-4 md:px-10"></div>
      </div>
      <div className="px-4 md:px-10 mx-auto w-full -mt-24 mb-24">
        <div className="flex flex-wrap">
          {user.isMainUser && (
            <div className={`w-full xl:w-8/12 mb-12 xl:mb-0 px-4 ${brandName ? "" : "mx-auto"}`}>
              <SettingsCard />
            </div>
          )}

          <div className="w-full xl:w-4/12 px-4">
            <ApiCard />
            {user.isMainUser && <TeamCard />}
            {/* Change password card */}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
