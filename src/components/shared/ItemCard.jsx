import { useStoreState } from "easy-peasy";
import { useLang } from "../../i18n/provider";
import { getColorConf, getIconConf } from "../../utils/styles";
import { ClientDisplay } from "../shared/ClientDisplay";
import { IconButton } from "./Button";
import { Card } from "./Card";
import { Copyable } from "./Copyable";
import { EventComponent } from "./EventsView";

export const ItemCard = ({
  _id,
  status,
  client,
  timestamps,
  warehouse,
  deliverer,
  events,
  product,
}) => {
  const color = getColorConf("items", status);
  const icon = getIconConf("items", status);

  const lang = useLang();
  const authUser = useStoreState((state) => state.auth.user);

  return <h1>depracated</h1>;

  return (
    <Card>
      <div className="grid grid-cols-4 gap-x-3 gap-y-3">
        {/*  */}
        <IconButton icon={icon} iconColor={color} />
        <div
          className={`col-span-2 text-xl text-${color} flex items-center justify-center gap-x-1`}>
          <Copyable text={_id} />
        </div>
        <IconButton icon="qrcode" className="ml-auto" iconColor={color} />
        {/*  */}
        <ClientDisplay client={client} />
        {/*  */}
        {/* warehouse */}

        {/* deliverer */}
        <div
          className="col-span-4 flex flex-col overflow-y-scroll rounded-md bg-gray-100 p-3"
          style={{ maxHeight: "70vh" }}>
          <div>
            {events.map((event) => (
              <EventComponent
                key={event._id}
                description={event[lang]}
                authUser={authUser}
                {...event}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
