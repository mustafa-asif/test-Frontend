import { Fragment } from "react";
import { ApiCard } from "../../components/shared/ApiCard";
import { withCatch } from "../../components/shared/SafePage";
import { SettingsCard } from "../../components/warehouse/SettingsCard";
import { TeamCard } from "../../components/warehouse/TeamCard";

function AccountPage(props) {
  return (
    <Fragment>
      <div className="relative pb-32" style={{ marginTop: -65, paddingTop: 75 }}>
        <div
          className="absolute bg-gradient-to-r from-yellow-500 to-yellow-600 left-0 right-0"
          style={{ top: -600, bottom: -75, zIndex: -1 }}></div>
      </div>
      <div className="relative px-4 md:px-10 mx-auto w-full -mt-24 mb-24">
        <div className="w-full  mb-12 xl:mb-0 px-4">
          <SettingsCard />
        </div>
        <div className="flex gap-x-5 w-full px-4 mt-[50px]">
          <ApiCard />
          {/* <TeamCard /> */}
        </div>
      </div>
    </Fragment>
  );
}

export default withCatch(AccountPage);
