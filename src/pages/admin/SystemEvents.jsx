import SystemEventCard from "../../components/admin/SystemEventCard";
import { DocumentsManager } from "../../components/shared/DocumentsManager";
import { withCatch } from "../../components/shared/SafePage";
import { CardSkeleton } from "../../components/skeletons/CardSkeleton";
import { Copyable } from "../../components/shared/Copyable";
import { useState } from "react";

const SystemEventTypes = () => {
  const eventTypes = [
    "print_container_orders",
    "download_container_orders_xls",
    "phone_reveal",
    "deliverer_deactivated",
    "login_as_client"
  ];
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow flex flex-col items-center p-0 m-0 max-w-xs min-w-[220px]">
      <div className="relative w-full">
        <button
          className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm text-gray-700 bg-gray-50 text-left focus:outline-none focus:ring-2 focus:ring-blue-200"
          onClick={() => setOpen((v) => !v)}
        >
          Copy an event type
        </button>
        {open && (
          <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg min-w-full">
            {eventTypes.map((type) => (
              <Copyable key={type} text={type} className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer text-left">
                {type}
              </Copyable>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function SystemEventsPage() {
  return (
    <DocumentsManager
      model="systemEvents"
      DocumentCard={SystemEventCard}
      initialFilters={{ keyword: "", date: "today" }}
      LoadingCard={(props) => (
        <CardSkeleton partsCount={4} type={2} {...props} />
      )}>
      <SystemEventTypes />
    </DocumentsManager>
  );
}

export default withCatch(SystemEventsPage); 