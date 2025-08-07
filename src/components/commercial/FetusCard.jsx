import { Button } from "../shared/Button";
import { Card } from "../shared/Card";
import { Copyable } from "../shared/Copyable";
import { HumanDate } from "../shared/HumanDate";
import { Pic } from "../shared/Pic";
import { getMostRecentTimestamp } from "../../utils/misc";
import { Whatsapp } from "../shared/Whatsapp";
import { useConfirmation, useQuickEditor } from "../shared/ToolsProvider";
import { xFetch } from "../../utils/constants";
import { useStoreActions } from "easy-peasy";

export const FetusCard = ({ _id, name, phone, client, timestamps, ...rest }) => {
  const [isSaving, editDocument, deleteDocument, customFunc] = useQuickEditor(_id, "fetuses");
  const removeFetus = useStoreActions(actions => actions.fetuses.removeFetus);

  const promptConfirm = useConfirmation();

  async function verifyUser() {
    async function fetch() {
      return await xFetch(`/auth/fetuses/${phone}`, { method: "PATCH" });
    }
    function cleanup() {
      removeFetus(_id);
    }

    return customFunc(fetch, cleanup);
  }

  async function deleteUser() {
    async function fetch() {
      return await xFetch(`/auth/fetuses/${phone}`, { method: "DELETE" });
    }
    function cleanup() {
      removeFetus(_id);
    }

    return customFunc(fetch, cleanup);
  }
  return (
    <Card loading={isSaving}>
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-full text-sm font-light text-gray-400 hover:text-green-500 flex items-center col-span-2 -mt-1">
          <Copyable text={_id} />
        </div>
        <div className="rounded-full text-sm font-light text-gray-400 flex items-center col-span-2 justify-end -mt-1">
          <HumanDate date={getMostRecentTimestamp(timestamps)} long />
        </div>
        <div className="rounded-full h-10 text-sm font-semibold flex items-center justify-between col-span-4">
          <Pic image={client.brand.image} className="mr-1" />
          <span className="line-clamp-2">{name}</span>
          <Whatsapp number={phone} label={phone} />
        </div>

        <Button
          btnColor="red"
          icon="trash"
          className="h-8 col-span-2"
          disabled={isSaving}
          onClick={() => promptConfirm({ title: "Delete User?", onConfirm: deleteUser })}
        />
        <Button
          btnColor="primary"
          icon="check"
          className="h-8 col-span-2"
          disabled={isSaving}
          onClick={() => promptConfirm({ title: "Manually Verify User?", onConfirm: verifyUser })}
        />
      </div>
    </Card>
  );
};
