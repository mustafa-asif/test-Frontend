import { useStoreState } from "easy-peasy";
import { IconButton } from "../shared/Button";
import { Input } from "../shared/Input";
import { Copyable } from "../shared/Copyable";
import { useTranslation } from "../../i18n/provider";

export const LinkCard = () => {
  const tl = useTranslation();
  const clientId = useStoreState(state => state.auth.user?.client?._id);
  return (
    <div
      className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-xl bg-white"
      style={{
        boxShadow: "0px 0px 30px rgba(16, 185, 129, 0.1), inset 0 -10px 15px 0 rgba(16, 185, 129, 0.2)",
      }}
    >
      <div className="rounded-t mb-0 p-5 bg-transparent">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full max-w-full grow flex-1">
            <h2 className="text-gray-700 text-xl font-semibold">{tl("share_link")}</h2>
            <p className="text-gray-500">{tl("share_link_desc")}</p>
          </div>
        </div>
      </div>
      <div className="pb-10 px-4 inline-flex items-center">
        <Copyable
          text={<Input defaultValue={getUrl(clientId)} readOnly />}
          copyText={getUrl(clientId)}
          className="w-full"
        />
        <Copyable text={<IconButton icon="copy" iconColor="green" className="ml-3" />} copyText={getUrl(clientId)} />
      </div>
    </div>
  );
};

function getUrl(clientId) {
  return `https://livo.ma/?r=${clientId}`;
}
