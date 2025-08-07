import { Menu, MenuItem } from "@mui/material";
import { createRef, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IconButton } from "./Button";
import { HumanDate } from "./HumanDate";
import { useStoreActions, useStoreState } from "easy-peasy";
import { xFetch } from "../../utils/constants";
import { useUpdates } from "../../hooks/useUpdates";
import { cl } from "../../utils/misc";

// const dummy = [
//   {
//     fr: "Test notification",
//     link: `orders abcd`,
//     date_created: new Date(),
//     seen: false,
//     _id: "1",
//   },
//   {
//     fr: "Second test notification",
//     link: `pickups abcd`,
//     date_created: new Date(),
//     seen: false,
//     _id: "2",
//   },
// ];

export const NotificationsDropdown = () => {
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const startListeningWS = useUpdates("notifications");
  const notifications = useStoreState((state) => state.notifications.notifications);
  const addNotifications = useStoreActions((actions) => actions.notifications.addNotifications);
  const updateNotification = useStoreActions((actions) => actions.notifications.updateNotification);

  const anchorEl = useRef();

  const toggleOpen = (e) => {
    if (isOpen) {
      // closing
      setOpen(false);
      return markAllAsSeen();
    }
    setOpen(true);
  };

  async function fetchNotifications() {
    const { data, error } = await xFetch(`/notifications`);
    setLoading(false);
    if (error) console.error(error);
    return data;
  }

  useEffect(() => {
    fetchNotifications().then((data) => {
      if (data) {
        addNotifications(data);
        startListeningWS();
      }
    });
  }, []);

  function markAllAsSeen() {
    for (const { _id } of notifications) {
      updateNotification({
        _id,
        updateDescription: { updatedFields: { seen: true }, removedFields: [] },
      });
    }
    xFetch(`/notifications`, {
      method: "PATCH",
      body: { ids: notifications.map((notif) => notif._id), seen: true },
    })
      .then(({ data, error }) => {
        if (error) console.error(error);
      })
      .catch(console.error);
  }

  return (
    <div className="relative">
      <span ref={anchorEl}>
        <IconButton
          icon="bell"
          badge={notifications.filter((notif) => !notif.seen).length}
          onClick={toggleOpen}
          disabled={isLoading}
        />
      </span>
      <Menu
        className="mt-1"
        anchorEl={anchorEl.current}
        keepMounted
        open={isOpen}
        onClose={toggleOpen}
        MenuListProps={{
          disablePadding: true,
        }}>
        {notifications.map((notif) => (
          <NotificationComponent key={notif._id} {...notif} />
        ))}
        {notifications.length < 1 && (
          <CustomMenuItem>
            <div className="px-4 py-3 ">{"No notifications"}</div>
          </CustomMenuItem>
        )}
        {/* <CustomMenuItem>
          <button className="py-2 px-2 w-full font-bold text-center text-white bg-gray-700 ">
            {"Mark as Read"}
          </button>
        </CustomMenuItem> */}
      </Menu>
    </div>
  );
};

function NotificationComponent({ _id, fr, timestamps, link, seen }) {
  const splitLink = link?.split(" ");

  return (
    <CustomMenuItem
      component={link ? Link : undefined}
      to={link ? `/view/${splitLink[0]}/${splitLink[1]}` : undefined}>
      <div
        className={cl("flex items-center px-4 py-3 -mx-2 border-b w-full", {
          "cursor-default": !link,
        })}>
        <span
          className={`p-2 text-lg text-primary-alt ${
            seen ? "bg-gray-300" : "bg-primary"
          } inline-flex items-center justify-center rounded-full shadow-md`}>
          <i className="fas fa-circle"></i>
        </span>
        <p className="mx-2 text-sm text-gray-600">
          <span className={`${seen ? "" : "font-extrabold"}`} href="#">
            {fr}
          </span>{" "}
          . <HumanDate date={timestamps.created} long />
        </p>
      </div>
    </CustomMenuItem>
  );
}

function CustomMenuItem({ children, ...props }) {
  return (
    <MenuItem {...props} style={{ padding: 0 }} disableRipple disableTouchRipple>
      {children}
    </MenuItem>
  );
}
