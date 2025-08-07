import { Fragment, useEffect, useState } from "react";
import { withCatch } from "../../components/shared/SafePage";
import { fakeWaiting, xFetch } from "../../utils/constants";
import { NothingCard } from "../../components/shared/NothingCard";
import { Card } from "../../components/shared/Card";
import {
  CircularProgress,
  Skeleton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { StatusDisplay } from "../../components/shared/StatusDisplay";
import { AltButton } from "../../components/shared/Button";
import { AutoSmsContentInput } from "../../components/shared/AutoSmsContentInput";
import { cl } from "../../utils/misc";
import { useToast } from "../../hooks/useToast";
import { useStoreActions, useStoreState } from "easy-peasy";

function AutoSmsPage() {
  const { documents, loading, inited } = useStoreState((state) => state.autosms);
  const setDocuments = useStoreActions((actions) => actions.autosms.setDocuments);
  const addDocuments = useStoreActions((actions) => actions.autosms.addDocuments);

  const client = useStoreState((state) => state.auth.user.client);

  const [error, setError] = useState(null);

  async function fetchDocuments() {
    if (loading && inited) return;
    setDocuments({ loading: true });
    const { data, error } = await xFetch(`/auto_sms`);
    setDocuments({ loading: false });
    console.log(data);
    if (error) {
      setError(error);
      return;
    }
    addDocuments(data);
  }

  const ordersStatus = [
    "draft",
    "pending",
    "problem",
    "awaiting transfer",
    "in progress",
    "fulfilled",
    "cancelled",
  ];

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <Fragment>
      <div className="relative pb-32" style={{ marginTop: -65, paddingTop: 75 }}>
        <div
          className="absolute bg-gradient-to-r from-yellow-500 to-yellow-600 left-0 right-0"
          style={{ top: -600, bottom: -75, zIndex: -1 }}></div>
      </div>
      <div className="relative px-4 md:px-10 mx-auto w-full -mt-24 mb-24">
        <div className=" p-4 bg-white shadow-lg hover:shadow-xl transition duration-300 rounded-md z-10  mb-[20px]">
          Keep your customers engaged and informed with automated SMS messages on their orders
          progress.
          <br />
          <div className="flex items-center gap-[5px] text-sm">
            <span className="opacity-60">Rate</span>
            <span className="font-bold">{client.sms.rate} DH</span>
            <span>/</span>
            <span>sms</span>
          </div>
        </div>
        {error && (
          <NothingCard>
            <div className="flex items-center gap-[10px] text-red-500 text-lg">
              <i className="fas fa-exclamation-triangle"></i>
              <p>{error}</p>
            </div>
          </NothingCard>
        )}
        {!error && (
          <Card>
            <TableContainer>
              <Table aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Activé</TableCell>
                    <TableCell align="center">Message</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ordersStatus.map((status) => (
                    <Row
                      key={status}
                      status={status}
                      previousData={documents.find(
                        (doc) => doc.model === "orders" && doc.status === status && !!doc.client
                      )}
                      defaultContent={
                        documents.find(
                          (doc) =>
                            doc.model === "orders" &&
                            doc.status === status &&
                            !doc.client &&
                            doc.active
                        )?.content
                      }
                      loading={loading}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}
      </div>
    </Fragment>
  );
}

export default withCatch(AutoSmsPage);

function Row({ status, previousData, defaultContent, loading }) {
  const replaceDocument = useStoreActions((actions) => actions.autosms.replaceDocument);
  const addDocuments = useStoreActions((actions) => actions.autosms.addDocuments);

  if (!defaultContent) {
    return <></>;
  }

  const showToast = useToast();
  const [fields, setFields] = useState({
    content: "",
    active: false,
  });
  const [isSaving, setSaving] = useState(false);

  const isLoading = loading || isSaving;

  const hasChanged =
    previousData &&
    (previousData.content !== fields.content || previousData.active !== fields.active);

  function discardChanges() {
    setFields({
      content: previousData?.content || "",
      active: !!previousData?.active,
    });
  }

  async function saveEdits() {
    if (isLoading || !previousData || !hasChanged) return;
    setSaving(true);
    const { error } = await xFetch(`/auto_sms/${previousData._id}`, {
      method: "PATCH",
      body: fields,
    });
    setSaving(false);
    if (error) {
      showToast(error, "error");
      return;
    }
    replaceDocument({ _id: previousData._id, data: { ...previousData, ...fields } });
    showToast("success", "success");
  }

  async function createNew() {
    if (isLoading || previousData) return;
    setSaving(true);
    const { data, error } = await xFetch("/auto_sms", {
      method: "POST",
      body: { ...fields, model: "orders", status },
    });
    setSaving(false);
    if (error) {
      showToast(error, "error");
      return;
    }
    addDocuments([data]);
    showToast("success", "success");
  }

  function handleSave() {
    if (previousData) {
      saveEdits();
    } else {
      createNew();
    }
  }

  useEffect(() => {
    if (previousData) {
      console.log("data changed");
      setFields({
        content: previousData.content,
        // active: previousData.active,
        active: false,
      });
    } else if (defaultContent) {
      setFields({ content: defaultContent, active: false });
    }
  }, [previousData]);

  return (
    <TableRow key={status} status={status}>
      <TableCell>
        <div className="w-[30px]">{isLoading && <CircularProgress size={24} />}</div>
      </TableCell>

      <TableCell align="left">
        <StatusDisplay model="orders" status={status} />
      </TableCell>
      <TableCell align="center">
        <Switch
          defaultChecked={false}
          readOnly
          disabled
          // checked={fields.active}
          // onChange={(_e, checked) => setFields({ ...fields, active: checked })}
          // disabled={isLoading}
        />
      </TableCell>
      <TableCell className={cl({ "opacity-50 pointer-events-none": !fields.active })}>
        <AutoSmsContentInput
          value={fields.content}
          onValueChange={(content) => setFields({ ...fields, content })}
          // disabled={isLoading}
          disabled
        />
        {defaultContent && (
          <div className="mt-[10px]">
            <span className="opacity-70">Default:</span> <span>{defaultContent}</span>
          </div>
        )}
      </TableCell>
      <TableCell>
        <div className="flex gap-x-[5px] justify-end hidden">
          <AltButton
            color="yellow"
            disabled={isLoading}
            className={cl({ invisible: !hasChanged })}
            onClick={discardChanges}
            label={
              <div className="flex items-center gap-[5px]">
                <i className="fas fa-undo"></i> discard changes
              </div>
            }
          />
          <AltButton
            disabled={isLoading || (previousData && !hasChanged) || !fields.content}
            onClick={handleSave}
            label={
              <div className="flex items-center gap-[5px]">
                <i className="fas fa-save"></i> save
              </div>
            }
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
