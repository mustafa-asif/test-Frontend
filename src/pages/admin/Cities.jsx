import { Fragment } from "react";
import { CitySettings } from "../../components/admin/CitySettings";
import { withCatch } from "../../components/shared/SafePage";
import { ColorBanner } from "../../components/shared/ColorBanner";

function CitiesPage() {
  return (
    <Fragment>
      <div className="relative pb-6">
        <ColorBanner />
      </div>
      <div className="relative px-4 md:px-10 mx-auto w-full mb-24">
        <CitySettings />
      </div>
    </Fragment>
  );
}

export default withCatch(CitiesPage);
