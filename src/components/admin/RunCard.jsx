import { useStoreActions } from "easy-peasy";
import { useState } from "react";
import { useToast } from "../../hooks/useToast";
import { xFetch } from "../../utils/constants";
import { Button, IconButton } from "../shared/Button";
import { Card } from "../shared/Card";
import { Copyable } from "../shared/Copyable";
import { HumanDate } from "../shared/HumanDate";
import { useConfirmation } from "../shared/ToolsProvider";

// _id: string;
// job_name: string;
// date_executed: Date;
// trigger: "auto" | "manual";
// success: boolean;
// logs?: string;

export const RunCard = ({ _id, job_name, date_executed, trigger, success, logs }) => {
  return (
    <Card>
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-full text-sm font-light text-gray-400 hover:text-green-500 flex items-center col-span-2 -mt-1 cursor-pointer">
          <Copyable text={_id} />
        </div>
        <div className="rounded-full text-sm font-light text-gray-400 flex items-center col-span-2 justify-end -mt-1">
          <HumanDate date={date_executed} long />
        </div>

        <div className="my-1 col-span-4">
          <p>
            <span className="text-gray-400">Job Name:</span> {job_name}
          </p>
          <p>
            <span className="text-gray-400">Trigger:</span> {trigger}
          </p>
          <p>
            <span className="text-gray-400">Status:</span>
            {success ? <span className="text-green-500 ml-1 font-bold">Success ✅</span> : <span className="text-red-500 ml-1 font-bold">Failed ❌</span>}
          </p>
          {logs && (
            <p>
              <span className="text-gray-400">Logs:</span> {logs}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};
