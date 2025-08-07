import { Link } from "react-router-dom";
import { Button } from "../shared/Button";
import { Card } from "../shared/Card";
import { Copyable } from "../shared/Copyable";
import { HumanDate } from "../shared/HumanDate";
import { Pic } from "../shared/Pic";
import { getMostRecentTimestamp } from "../../utils/misc";
import { Tags } from "../shared/Tags";
import { useQuickEditor } from "../shared/ToolsProvider";
import { useStoreState } from "easy-peasy";

export const ClientCard = ({ _id, active, identity_verified, client, timestamps, ...rest }) => {
  const color = (() => {
    if (active && identity_verified) return "text-green-500";
    if (active) return "text-yellow-500";
    return "text-red-500";
  })();
  const [isSaving, editDocument] = useQuickEditor(_id, "users");

  const authUser = useStoreState((state) => state.auth.user);

  return (
    <Card>
      <div className="grid grid-cols-4 gap-2">
        <div className="col-span-4 flex items-center justify-between whitespace-nowrap gap-x-2">
          <div className="flex items-center gap-x-2">
            <span className="text-sm font-light text-gray-400 hover:text-green-500">
              <Copyable text={client._id} />
            </span>
            <span className="text-sm uppercase bg-blue-50 px-2 text-black font-bold rounded-md shadow-sm flex items-center justify-center">
              {client.pack}
            </span>
            <Tags
              value={client.tags}
              onChange={(tags) => editDocument({ client: { tags } })}
              isLoading={isSaving}
              canEdit
              canRemove
            />
          </div>
          <div className="flex items-center">
            <span className="text-sm font-light text-gray-400">
              <HumanDate date={getMostRecentTimestamp(timestamps)} long />
            </span>
          </div>
        </div>

        <div className="rounded-full h-10 text-sm font-semibold flex items-center col-span-3">
          <Pic image={client.brand.image} className="mr-1" />
          <span className="line-clamp-2">{client.brand.name}</span>
          <i className={`fas fa-circle ml-2 ${color}`}></i>
          {client.tenant && (
            <span className="ml-1 h-6 min-w-6 px-1 rounded-full bg-blue-50 text-blue-500 border border-solid border-blue-100 flex items-center justify-center">
              {client.tenant.domain}
            </span>
          )}
        </div>

        <Link to={`/clients/${_id}/edit`}>
          <Button btnColor="gray" icon="pen" className="h-10" />
        </Link>

        {authUser.isMainUser && client.assigned_commercial && (
          <div className="col-span-4 col-span-4 flex items-center gap-x-2">
            <span className="h-6 w-max px-2 rounded-full bg-gray-50 text-sm text-yellow-500 border border-solid border-yellow-100 flex gap-x-1 items-center justify-center">
              <span className="font-light text-xs">commercial:</span>
              <span className="font-bold">{client.assigned_commercial.name} </span>
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};
