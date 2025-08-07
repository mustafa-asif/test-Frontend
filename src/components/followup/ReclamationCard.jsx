import { ActionsMenu } from "../shared/ActionsMenu";
import { Copyable } from "../shared/Copyable";
import { MessagesButton } from "../shared/MessagesButton";
import { HumanDate } from "../shared/HumanDate";
import { Card } from "../shared/Card";
import { Pic } from "../shared/Pic";
import { Tags } from "../shared/Tags";
import { useQuickEditor } from "../shared/ToolsProvider";
import { getMostRecentTimestamp } from "../../utils/misc";
import { ClientDisplay } from "../shared/ClientDisplay";

export const ReclamationCard = ({
  _id,
  title,
  client,
  followup,
  tags,
  status,
  messages,
  timestamps,
}) => {
  const [isSaving, editDocument, deleteDocument] = useQuickEditor(_id, "tickets");

  return (
    <Card loading={isSaving}>
      <div className="grid grid-cols-4 gap-2">
        <div className="col-span-4 flex justify-between items-center whitespace-nowrap gap-x-1">
          <div className="flex items-center gap-x-2">
            <span className="font-light text-sm text-gray-400 hover:text-green-500">
              <Copyable text={_id} />
            </span>

            <Tags
              value={tags}
              onChange={(tags) => editDocument({ tags })}
              isLoading={isSaving}
              canEdit
              canRemove
            />
          </div>
          <div className="flex items-center">
            <span className="font-light text-sm text-gray-400">
              <HumanDate date={getMostRecentTimestamp(timestamps)} long />
            </span>
          </div>
        </div>
        <ClientDisplay client={client} />

        {!followup ? (
          <div className="rounded-full h-10 flex items-center col-span-4 bg-white border-2 border-dashed border-gray-200 text-xl text-gray-400 cursor-default">
            <p className="text-center text-sm flex-1">none interacted</p>
          </div>
        ) : (
          <div className="col-span-4 flex gap-x-1">
            <div className="rounded-full h-10 flex-1 flex items-center col-span-2 bg-green-100 shadow-sm ">
              <Pic image={followup.image} className="mr-2" />
              <a className="line-clamp-1" href={`tel:${followup.phone}`}>
                {followup.name}
              </a>
            </div>
          </div>
        )}
        <div className="col-span-4 text-lg font-medium text-gray-600">
          <p>{title}</p>
        </div>
        <MessagesButton
          messages={messages}
          status={status}
          link={`/tickets/${_id}/chat`}
          size="col-span-3"
        />

        <ActionsMenu
          _id={_id}
          model="tickets"
          editDocument={editDocument}
          deleteDocument={deleteDocument}
          status={status}
          closed={["urgent", "stalled", "opened"].includes(status)}
          opened={["closed", "stalled", "urgent"].includes(status)}
          urgent={["stalled", "opened"].includes(status)}
          stalled={["urgent", "opened"].includes(status)}
        />
      </div>
    </Card>
  );
};
