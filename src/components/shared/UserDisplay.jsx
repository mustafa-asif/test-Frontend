import { Pic } from "./Pic";

export const UserDisplay = ({ user, ...props }) => {
  return (
    <div
      className="rounded-full h-10 text-sm font-semibold flex items-center col-span-2"
      {...props}>
      <Pic image={user.image} className="bg-gray-200 mr-1" />
      <span className="line-clamp-2">{user.name}</span>
    </div>
  );
};
