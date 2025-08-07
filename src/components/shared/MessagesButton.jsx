import { useStoreState } from "easy-peasy";
import { Link } from "react-router-dom";
import { cl } from "../../utils/misc";

export const MessagesButton = ({ messages, status, link, size = "col-span-1" }) => {
  const user = useStoreState((state) => state.auth.user);
  // Filter out internal messages for clients
  const visibleMessages = user?.role === "client" 
    ? messages.filter(msg => !msg.internal)
    : messages;
  const lastMessage = visibleMessages[visibleMessages.length - 1];

  const isNew = (() => {
    if (!lastMessage) return false;
    if (lastMessage.user._id === user._id) return false;
    if (lastMessage?.seen.some((saw) => saw.user._id === user._id)) return false;
    return true;
  })();

  const isSender = lastMessage?.user._id === user._id;
  const pingColor =
    user.role === "client"
      ? "text-red-500"
      : lastMessage?.user.role === "client"
      ? "text-red-500"
      : "text-yellow-500";

  return (
    <Link to={link} className={`${size}`}>
      <div
        className={`${
          !isSender
            ? "bg-green-100 hover:bg-green-200 font-bold text-green-500"
            : "bg-gray-100 hover:bg-gray-200 text-gray-500"
        } relative rounded-full h-10 flex items-center justify-center px-2 shadow-sm hover:shadow-md transition duration-300 cursor-pointer`}>
        <i className="fas fa-comment px-1"></i>
        <span className="line-clamp-1">{lastMessage?.text}</span>
        {isNew && (
          <>
            <i
              className={
                "fas fa-circle text-xs absolute right-0 top-0 animate-ping " + pingColor
              }></i>
            <i className={"fas fa-circle text-xs absolute right-0 top-0 " + pingColor}></i>
          </>
        )}
      </div>
    </Link>
  );
};

export const SmallMessagesButton = ({ model, _id, lastMessage }) => {
  const user = useStoreState((state) => state.auth.user);

  // Skip internal messages for clients
  if (lastMessage?.internal && user?.role === "client") {
    return null;
  }

  const isNew = (() => {
    if (!lastMessage) return false;
    if (lastMessage.user._id === user._id) return false;
    if (lastMessage?.seen.some((saw) => saw.user._id === user._id)) return false;
    return true;
  })();

  const isSender = lastMessage?.user._id === user._id;

  return (
    <Link to={`/${model}/${_id}/chat`}>
      <div
        className={cl(
          " h-8 border-2 border-black/10 rounded-full flex items-center shadow-sm hover:shadow-md justify-center cursor-pointer text-sm relative",
          { "bg-gray-100 hover:bg-gray-200 text-gray-500": isSender },
          { "bg-green-100 text-green-500": !isSender },
          { "w-8": !lastMessage },
          { "px-[10px] gap-[5px] max-w-[100px]": lastMessage }
        )}>
        <i className={`fas fa-comment`}></i>
        <span className="line-clamp-1">{lastMessage?.text}</span>

        {isNew && (
          <>
            <i className="fas fa-circle text-xs absolute right-0 top-0 animate-ping text-red-500"></i>
            <i className="fas fa-circle text-xs absolute right-0 top-0 text-red-500"></i>
          </>
        )}
      </div>
    </Link>
  );
};
