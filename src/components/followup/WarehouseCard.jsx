import { Link } from "react-router-dom";
import { Button } from "../shared/Button";
import { Card } from "../shared/Card";
import { Copyable } from "../shared/Copyable";
import { Pic } from "../shared/Pic";
import { useQuickEditor } from "../shared/ToolsProvider";
import { HumanDate } from "../shared/HumanDate";

export const WarehouseCard = ({ _id, image, active, deleted, timestamps, ...rest }) => {
  const [isSaving, editDocument, deleteDocument] = useQuickEditor(_id, "warehouses");
  return (
    <Card loading={isSaving}>
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-full text-sm font-light text-gray-400 hover:text-green-500 flex items-center col-span-2 -mt-1 cursor-pointer">
          <Copyable text={_id} />
        </div>
        <div className="rounded-full text-sm font-light text-gray-400 flex items-center col-span-2 justify-end -mt-1">
          <HumanDate date={timestamps.created} long />
        </div>
        <div className="rounded-full h-10 text-sm font-semibold flex items-center col-span-3">
          <Pic image={image} className="mr-1" />
          <span className="line-clamp-2">
            {rest.warehouse.city} ({rest.warehouse.name})
          </span>
          <i className={`fas fa-circle ml-2 text-${getColor(active, deleted)}`}></i>
        </div>
        <Link to={`/warehouses/${_id}/edit`}>
          <Button btnColor="gray" icon="pen" className="h-10" />
        </Link>
      </div>
    </Card>
  );
};

function getColor(active, deleted) {
  if (!active || deleted) return "red-500";
  return "green-500";
}
