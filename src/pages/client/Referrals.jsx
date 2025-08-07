import { useStoreActions, useStoreState } from "easy-peasy";
import { Fragment, useState, useEffect } from "react";
import { StatBox } from "../../components/shared/StatBox";
import { StatBoxSkeleton } from "../../components/skeletons/StatBoxSkeleton";
import useFirstVisit from "../../hooks/useFirstVisit";
import { LinkCard } from "../../components/client/LinkCard";
import { ReferralsCard } from "../../components/client/ReferralsCard";
import { AssetsCard } from "../../components/client/AssetsCard";
import { useToast } from "../../hooks/useToast";
import { xFetch } from "../../utils/constants";
import { useTranslation } from "../../i18n/provider";
import { ColorBanner } from "../../components/shared/ColorBanner";

export default function ReferralsPage() {
  useFirstVisit(refreshReferrals, "referrals");
  const showToast = useToast();
  const tl = useTranslation();

  const setReferrals = useStoreActions((actions) => actions.referrals.setReferrals);
  const { loading, stats } = useStoreState((state) => state.referrals);

  async function refreshReferrals() {
    console.log("refreshing referrals");
    const { data: data1, error1 } = await xFetch("/referrals");
    const { data: data2, error2 } = await xFetch("/referrals/stats");
    setReferrals({ loading: false });

    if (error1) showToast("error", error1);
    else setReferrals({ referrals: data1 });

    if (error2) showToast("error", error2);
    else setReferrals({ stats: data2 });
  }

  useEffect(() => {
    refreshReferrals();
  }, []);

  return (
    <Fragment>
      <div className="relative pb-32" style={{ marginTop: -65, paddingTop: 75 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 w-full px-4 md:px-10 mb-5"></div>
        <div className="px-4 md:px-10 mx-auto w-full">
          <div>
            <div className="flex gap-y-[15px] flex-wrap">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <div className="w-full lg:w-6/12 xl:w-3/12 px-4" key={i}>
                    <StatBoxSkeleton />
                  </div>
                ))
              ) : (
                <>
                  <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                    {/* status?=fulfilled */}
                    <StatBox
                      title={tl("clicks")}
                      value={stats?.clicks}
                      unit={tl("visits")}
                      icon="eye"
                      iconColor="bg-green-500"
                    />
                  </div>
                  <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                    <StatBox
                      title={tl("invitees")}
                      value={stats?.referrals}
                      unit={tl("clients")}
                      icon="users"
                      iconColor="bg-green-700"
                    />
                  </div>
                  <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                    <StatBox
                      title={tl("conversion_rate")}
                      value={(stats?.conversion_rate | 0) * 100}
                      unit={"%"}
                      icon="percent"
                      iconColor="bg-gray-500"
                    />
                  </div>
                  <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                    <StatBox
                      title={tl("earning")}
                      value={stats?.earning}
                      unit={"dh"}
                      icon="money-bill"
                      iconColor="bg-gray-700"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <ColorBanner />
      </div>
      {/* */}
      <div className="px-4 md:px-10 mx-auto w-full -mt-24 mb-24">
        <div className="flex flex-wrap">
          <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
            <LinkCard />
            <ReferralsCard />
          </div>
          <div className="w-full xl:w-4/12 px-4">
            <AssetsCard />
          </div>
        </div>
      </div>
      {/*  */}
    </Fragment>
  );
}
