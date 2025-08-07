import { ActionsMenu } from "../shared/ActionsMenu";
import { Copyable } from "../shared/Copyable";
import { MessagesButton } from "../shared/MessagesButton";
import { HumanDate } from "../shared/HumanDate";
import { Card } from "../shared/Card";
import { Pic } from "../shared/Pic";
import { useQuickEditor } from "../shared/ToolsProvider";
import { getMostRecentTimestamp } from "../../utils/misc";

export const ReclamationCard = ({ _id, title, followup, status, messages, timestamps }) => {
  const [isSaving, editDocument, deleteDocument] = useQuickEditor(_id, "tickets");

  return (
    <Card loading={isSaving}>
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-full text-sm font-light text-gray-400 hover:text-green-500 flex items-center col-span-2 -mt-1 cursor-pointer">
          <Copyable text={_id} />
        </div>
        <div className="rounded-full text-sm font-light text-gray-400 flex items-center col-span-2 justify-end -mt-1">
          <HumanDate date={getMostRecentTimestamp(timestamps)} long />
        </div>
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
        />
      </div>
    </Card>
  );
};
