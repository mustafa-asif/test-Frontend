import { Pic } from "../shared/Pic";

export const DelivererDisplay = ({ deliverer: user }) => {
    return (
        <div className="rounded-full h-10 flex items-center col-span-2 bg-green-100 hover:bg-gray-800 hover:text-green-500 shadow-sm hover:shadow-md transition duration-300">
            <Pic image={user?.image} className="mr-2" />
            <a className="line-clamp-1" href={`tel:${user?.phone}`}>
                {user?.name}
            </a>
        </div>
    );
};
