import { Menu, MenuItem } from "@mui/material";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IconButton } from "./Button";
import { HumanDate } from "./HumanDate";
import { useStoreState } from "easy-peasy";

const dummy = [
  {
    text: "Test notification",
    type: "order",
    order: { _id: "orxyz1234" },
    date_created: new Date(),
    seen: false,
    _id: "axds",
  },
  {
    text: "Test notification",
    type: "order",
    order: { _id: "orxyz1234" },
    date_created: "01/01/2021",
    seen: true,
    _id: "axxss",
  },
];

export const MessagesDropdown = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const user = useStoreState((state) => state.auth.user);

  function toggleOpen(e) {
    if (anchorEl) setAnchorEl(null);
    else setAnchorEl(e.currentTarget);
  }

  // Filter out internal messages for clients
  const visibleMessages = user?.role === "client" 
    ? dummy.filter(msg => !msg.internal)
    : dummy;

  return (
    <div className="relative">
      <IconButton icon="comment" badge={2} onClick={toggleOpen} />
      <Menu
        className="mt-1"
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        onClose={toggleOpen}
        MenuListProps={{
          disablePadding: true,
        }}>
        {visibleMessages.map((message) => (
          <MessageComponent key={message._id} {...message} />
        ))}
        <CustomMenuItem>
          <button className="py-2 px-2 w-full font-bold text-center text-white bg-gray-700 ">
            {"Mark as Read"}
          </button>
        </CustomMenuItem>
      </Menu>
    </div>
  );
};

function CustomMenuItem({ children, ...props }) {
  return (
    <MenuItem {...props} style={{ padding: 0 }}>
      {children}
    </MenuItem>
  );
}

function MessageComponent({ _id, text, date_created, seen, type, internal, ...object }) {
  const user = useStoreState((state) => state.auth.user);
  
  // Skip internal messages for clients
  if (internal && user?.role === "client") {
    return null;
  }

  const type_id = object[type]._id;
  return (
    <CustomMenuItem component={Link} to={`/${type}s/${type_id}/chat`}>
      <div className="flex items-center px-4 py-3 -mx-2 border-b w-full">
        <span
          className={`p-2 text-lg text-white ${seen ? "bg-gray-300" : "bg-green-500"
            } inline-flex items-center justify-center rounded-full shadow-md`}>
          <i className="fas fa-comment"></i>
        </span>
        <p className={`mx-2 text-sm ${seen ? "text-gray-600" : "text-gray-800 font-extrabold"}`}>
          <span className={`block capitalize ${seen ? "font-bold" : ""}`}>
            {type} {type_id}
          </span>{" "}
          {text} . <HumanDate date={date_created} />
        </p>
        {!seen && (
          <span className="mx-2 text-md text-green-500">
            <i className="fas fa-circle"></i>
          </span>
        )}
      </div>
    </CustomMenuItem>
  );
}

function upCase(string = "") {
  return string[0].toUpperCase() + string.slice(1);
}
