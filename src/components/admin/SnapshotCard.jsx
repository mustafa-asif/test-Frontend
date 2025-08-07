import { useStoreActions } from "easy-peasy";
import { useState } from "react";
import { useToast } from "../../hooks/useToast";
import { API_URL, xFetch } from "../../utils/constants";
import { Button, IconButton } from "../shared/Button";
import { Card } from "../shared/Card";
import { Copyable } from "../shared/Copyable";
import { HumanDate } from "../shared/HumanDate";
import { useConfirmation, useQuickEditor } from "../shared/ToolsProvider";

export const SnapshotCard = ({ _id, filename, description, date_created, isDefault }) => {
  const [isLoading, setLoading] = useState(false);
  const [isSaving, editDocument, deleteDocument] = useQuickEditor(_id, "snapshots");

  const confirmAction = useConfirmation();
  const showToast = useToast();

  async function handleReset() {
    if (isLoading) return;
    setLoading(true);
    const { error } = await xFetch(`/snapshots/restore`, { method: "POST", body: { _id } });
    setLoading(false);
    if (error) return showToast(error, "error");
    showToast("success. reloading browser", "success");
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

  return (
    <Card loading={isLoading}>
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-full text-sm font-light text-gray-400 hover:text-green-500 flex items-center col-span-2 -mt-1 cursor-pointer">
          <Copyable text={_id} />
        </div>
        <div className="rounded-full text-sm font-light text-gray-400 flex items-center col-span-2 justify-end -mt-1">
          <HumanDate date={date_created} long />
        </div>

        <div className="my-1 col-span-4">
          <p>
            <span className="text-gray-400">filename:</span> {filename}
          </p>
          <p>
            <span className="text-gray-400">description:</span> {description}
          </p>
        </div>
        <div className="col-span-4 flex items-center gap-x-3">
          <ActiveCircle
            active={isDefault}
            loading={isSaving}
            onActivate={() => editDocument({ isDefault: true }, "confirm")}
            onDeactivate={() => editDocument({ isDefault: false }, "confirm")}
          />
          <Button
            label="Reset to Snapshot"
            onClick={() => confirmAction({ onConfirm: handleReset, title: "Are you sure?" })}
            disabled={isLoading}
          />
          <DownloadBtn filename={filename} />
          <IconButton icon="trash" onClick={() => confirmAction({ onConfirm: deleteDocument, title: "Are you sure?" })} disabled={isLoading} iconColor="red" />
        </div>
      </div>
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
        }`}></div>
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

function DownloadBtn({ filename }) {
  const link = `${API_URL}/snapshots/explore/${filename}`;
  return (
    <a href={link} download={link} target="_blank">
      <IconButton icon="download" iconColor="green" />
    </a>
  );
}
