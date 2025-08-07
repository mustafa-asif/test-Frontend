import { Switch } from "@mui/material";
import { cl } from "../../utils/misc";
import { ActiveCircle } from "./ActiveCircle";
import { AltButton, IconButton } from "./Button";
import { Card } from "./Card";
import { Copyable } from "./Copyable";
import { ModelDisplay } from "./ModelDisplay";
import { StatusDisplay } from "./StatusDisplay";
import { useQuickEditor } from "./ToolsProvider";
import { useState } from "react";

export const AutoSmsCard = ({ _id, model, status, active, content }) => {
  const [isSaving, editDocument, deleteDocument] = useQuickEditor(_id, "auto_sms");
  const [fields, setFields] = useState({ content, active });

  return (
    <Card loading={isSaving} className="p-[10px] col-span-4">
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-full text-sm font-light text-gray-400 hover:text-green-500 flex items-center col-span-2 -mt-1 cursor-pointer">
          <Copyable text={_id} />
        </div>
        {/*  */}
        <div className="col-span-4 flex gap-x-2 border-b border-gray-100 py-2">
          <p className="uppercase font-bold text-gray-600">Model</p>
          <div>
            <ModelDisplay model={model} />
          </div>
        </div>
        {/*  */}
        <div className="col-span-4 flex gap-x-2 border-b border-gray-100 py-2">
          <p className="uppercase font-bold text-gray-600">Status</p>
          <div>
            <StatusDisplay model={model} status={status} />
          </div>
        </div>

        {/*  */}
        <div className="col-span-4 flex gap-x-2 border-b border-gray-100 py-2">
          <p className="uppercase font-bold text-gray-600">Text</p>
          <span className="text-gray-500">{content}</span>
        </div>
        {/*  */}
        {/*  */}
        <div className="col-span-4 flex gap-x-2 border-b border-gray-100 py-2">
          <p className="uppercase font-bold text-gray-600">Active</p>
          <Switch
            checked={active}
            onChange={(e, active) => setFields({ ...fields, active })}
            disabled={isSaving}
          />
          {/* <ActiveCircle
            active={active}
            loading={isSaving}
            onActivate={() => editDocument({ active: true })}
            onDeactivate={() => editDocument({ active: false })}
          /> */}
        </div>
        {/*  */}

        <div className="col-span-4 flex items-center gap-x-3">
          <AltButton
            label={
              <div>
                <i className="text-sm fas fa-trash mr-[3px]"></i>delete
              </div>
            }
            color="red"
          />
          <AltButton
            label={
              <div>
                <i className="text-sm fas fa-pen mr-[3px]"></i>edit
              </div>
            }
          />
        </div>
      </div>
    </Card>
  );
};
