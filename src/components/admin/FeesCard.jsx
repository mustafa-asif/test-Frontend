import { Link } from "react-router-dom";
import { Card } from "../shared/Card";
import { Copyable } from "../shared/Copyable";
import { DataGrid } from "@mui/x-data-grid";
import { useQuickEditor } from "../shared/ToolsProvider";
import { API_URL } from "../../utils/constants";
import { useState } from "react";
import { cl } from "../../utils/misc";

export const FeesCard = ({ _id, active, packs, ...props }) => {
  const [isSaving, editDocument, deleteDocument] = useQuickEditor(_id, "fees");
  const [selectedPack, setSelectedPack] = useState(null);
  return (
    <Card loading={isSaving} className="col-span-4">
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-full text-sm font-light text-gray-400 hover:text-green-500 flex items-center col-span-2 -mt-1 cursor-pointer">
          <Copyable text={_id} />
        </div>
        <div className="rounded-full text-sm font-light text-gray-400 flex items-center col-span-2 justify-end -mt-1">
          <div className="flex items-center gap-x-3">
            <ActiveCircle
              active={active}
              loading={isSaving}
              onActivate={() => editDocument({ active: true }, "confirm")}
              onDeactivate={() => editDocument({ active: false }, "confirm")}
            />
            {!active && (
              <button
                onClick={deleteDocument}
                disabled={isSaving}
                className="outline-none focus:outline-none">
                <i className="fa fa-trash text-xl text-red-400 hover:text-red-500 transition-colors duration-200 cursor-pointer"></i>
              </button>
            )}
            <DownloadBtn id={_id} />
            <Link
              to={`/fees/${_id}/edit`}
              disabled={isSaving}
              className="outline-none focus:outline-none">
              <i className="fa fa-edit text-xl text-gray-400 hover:text-gray-500 transition-colors duration-200 cursor-pointer"></i>
            </Link>
          </div>
        </div>
      </div>
      <div className="my-1 p-2 bg-gray-100">
        <div className="flex gap-x-3">
          <p className="font-bold text-gray-600">PACKS: </p>
          {packs?.length > 0 ? (
            packs.map((pack) => (
              <span
                key={pack}
                onClick={() => setSelectedPack(selectedPack === pack ? null : pack)}
                className={cl(
                  "cursor-pointer text-white px-2 rounded-lg select-none",
                  { "bg-gray-600 hover:bg-gray-800 hover:shadow-md": !selectedPack },
                  {
                    "bg-gray-600 opacity-80 hover:opacity-100":
                      selectedPack && selectedPack !== pack,
                  },
                  { "bg-blue-800 shadow-lg": selectedPack === pack }
                )}>
                {pack}
              </span>
            ))
          ) : (
            <span className="text-red-600">NONE</span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Viewing Pack:{" "}
          <span
            className={cl({ "text-blue-800": !!selectedPack }, { "text-gray-700": !selectedPack })}>
            {selectedPack || "None"}
          </span>
        </p>
      </div>
      {Object.keys(typeOfConditions).map((prop) => (
        <div key={prop} className="mb-5 overflow-hidden">
          <div className="uppercase">{prop}</div>
          <div style={{ maxHeight: 200 }} className="overflow-y-auto">
            <div className="w-full my-2 relative mb-2">
              <DataGrid
                style={{ borderRadius: 8 }}
                disableColumnFilter
                disableColumnMenu
                hideFooter={props[prop].conditions.length < 100}
                headerHeight={35}
                rowHeight={35}
                disableSelectionOnClick
                autoHeight
                getRowId={(cond) => cond._id}
                columns={[
                  ...Object.keys(typeOfConditions[prop]).map((field) => ({
                    field,
                    headerName: field.replace(/_/g, " "),
                    editable: false,
                    width: 200,
                  })),
                  { field: "fee", headerName: "fee", editable: false, width: 200 },
                ]}
                rows={props[prop].conditions.filter((condition) => {
                  if (!selectedPack) return true;
                  // else if(!condition.pack) return true;
                  else return condition.pack === selectedPack;
                })}
              />
            </div>
          </div>
        </div>
      ))}
    </Card>
  );
};

function ActiveCircle({ active, onActivate, onDeactivate, loading }) {
  const classes = loading
    ? "bg-gray-200 hover:bg-gray-300 animate-pulse"
    : active
    ? "bg-green-500 hover:bg-green-400"
    : "bg-red-100 hover:bg-green-100";

  return (
    <div className="flex gap-x-1 items-center">
      <div
        className={`uppercase font-semibold ${
          loading ? "text-gray-600" : active ? "text-green-500" : "text-red-500"
        }`}>
        {loading ? "" : active ? "Active" : "Not Active"}
      </div>
      <div
        onClick={() => {
          if (loading) return;
          if (!active) return onActivate();
          if (active) return onDeactivate();
        }}
        className={`cursor-pointer shadow-sm hover:shadow-md rounded-full transition-all duration-200 ${classes}`}
        style={{ height: 27, width: 27 }}></div>
    </div>
  );
}

function DownloadBtn({ id }) {
  const link = `${API_URL}/fees/${id}/excel`;
  return (
    <a href={link} download={link} target="_blank">
      <i className="fa fa-download text-xl text-green-400 hover:text-green-500 transition-colors duration-200 cursor-pointer"></i>
    </a>
  );
}

const typeOfConditions = {
  order: {
    target_city: "city",
    warehouse_city: "city",
    pack: "string",
  },
  pickup: {
    target_city: "city",
    warehouse_city: "city",
    min_items: "number",
    max_items: "number",
    pack: "string",
  },
  transfer: {
    from_city: "city",
    to_city: "city",
    min_items: "number",
    max_items: "number",
    per_item: "boolean",
    pack: "string",
  },
  warehousing: {
    warehouse_city: "city",
    min_days: "number",
    max_days: "number",
    final: "boolean",
    pack: "string",
  },
  refusal: {
    target_city: "city",
    pack: "string",
  },
};
