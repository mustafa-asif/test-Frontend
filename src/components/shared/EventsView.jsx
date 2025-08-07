import { useStoreState } from "easy-peasy";
import { useFeedScroll } from "../../hooks/useFeedScroll";
import { useLang } from "../../i18n/provider";
import { getMostRecentTimestamp, modelIcon } from "../../utils/misc";
import { getColorConf, getIconConf } from "../../utils/styles";
import { HumanDate } from "./HumanDate";
import { useTranslation } from "../../i18n/provider";
import { Link } from "react-router-dom";

export const EventsView = ({ _id, model, events, status = "fulfilled" }) => {
  const lang = useLang();
  const tl = useTranslation();
  const authUser = useStoreState((state) => state.auth.user);
  const containerRef = useFeedScroll([events.length]);
  return (
    <div
      className="flex flex-col overflow-y-scroll min-h-full rounded-md bg-gray-100 text-xl"
      ref={containerRef}>
      <div className="relative m-3 sm:m-6">
        <div className="border-r-8 border-white absolute h-full top-0 left-5 shadow-lg rounded-full"></div>
        <ul className="list-none m-0 p-0">
          <li className="mb-6 flex items-center">
            <div
              className={`flex items-center justify-center h-12 w-12 bg-${getColorConf(
                model,
                status
              )} rounded-full shadow-lg z-20`}>
              <i className={`fas ${getIconConf(model, status)} text-white`}></i>
            </div>
            <div className="flex items-center ml-3 text-2xl">
              <span className="font-bold mr-3 capitalize">{tl(model.replace(/s$/, ""))}</span>
              <span className="text-lg">{_id}</span>
            </div>
          </li>
          {events.map((event) => (
            <EventComponent
              key={event._id}
              description={event[lang]}
              authUser={authUser}
              {...event}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export function EventComponent({ description, timestamps, user, authUser, date, related }) {
  const extra = authUser.role !== "client" ? `(${user?.name})` : "";
  const related_parts = related?.split(' ');
  return (
    <li className="mb-6 flex items-center">
      <Link to={related ? `/${related_parts[0]}s/${related_parts[1]}` : "#"} className="z-20">
        <div className="flex items-center justify-center p-3 bg-white rounded-full shadow-lg">
        <i className={`fas fa-${related ? modelIcon[related_parts[1].slice(0, 2)] : "circle"} text-gray-500`}></i>
        </div>
      </Link>
      <div className="w-full bg-white ml-3 p-3 items-center shadow-lg rounded-md">
        <span>{description}</span>
        <span className="block text-xs md:text-sm text-gray-500">
          <b>{user?.role}</b> <span className="capitalize">{extra}</span> ·{" "}
          <HumanDate date={getMostRecentTimestamp(timestamps) || date} long />
        </span>
      </div>
    </li>
  );
}

