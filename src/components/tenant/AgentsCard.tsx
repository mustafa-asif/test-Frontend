import { useEffect, useMemo, useState } from "react";
import { IconButton } from "../shared/Button";
import { AutocompleteInput, Input } from "../shared/Input";
import { Button } from "../shared/Button";
import { xFetch } from "../../utils/constants";
import { useToast } from "../../hooks/useToast";
import { useConfirmation } from "../shared/ToolsProvider";
import { xLogin } from "../../utils/auth";
import { getDifferences } from "../../utils/misc";
import { Card } from "../shared/Card";
import { useTranslation } from "../../i18n/provider";

export const AgentsCard = ({}) => {
  const tl = useTranslation();
  const showToast = useToast();
  const [fields, setFields] = useState({ name: "", phone: "", password: "", role: "" });
  const [agents, setAgents] = useState([]);
  const [expandedAdd, setExpandedAdd] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const { followups, commercials, roleChoices } = useMemo(() => {
    const data = {
      followups: agents.filter((agent) => agent.role === "followup"),
      commercials: agents.filter((agent) => agent.role === "commercial"),
      roleChoices: [],
    };

    if (data.followups.length === 0) data.roleChoices.push("followup");
    if (data.commercials.length === 0) data.roleChoices.push("commercial");

    return data;
  }, [agents]);

  async function fetchAgents() {
    const { data, error } = await xFetch(`/tenants/agents`);
    setLoading(false);

    if (data) setAgents(data);
    // setAgents([{ _id: "xzyza", name: "moahemd", phone: "google", role: "followup" }]);
  }

  async function handleAddAgent(e) {
    e.preventDefault();
    if (isLoading) return;
    setLoading(true);
    const { error, data } = await xFetch(`/tenants/agents`, { method: "POST", body: fields });
    setLoading(false);
    if (error || !data) return showToast(error, "error");
    showToast("success", "success");
    setFields({ name: "", password: "", phone: "", role: "" });
    setAgents((agents) => [...agents, data]);
    setExpandedAdd(false);
  }

  function toggleExpandedAdd() {
    setExpandedAdd((expandedAdd) => {
      if (expandedAdd) {
        setFields({ name: "", phone: "", role: "", password: "" });
      }

      return !expandedAdd;
    });
  }

  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <Card className="w-[250px] md:w-[375px] h-max">
      {/*  */}
      <div className="rounded-t mb-0 py-3 border-0">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full max-w-full grow flex-1">
            <h3 className="font-semibold text-xl text-gray-700">{tl("team")}</h3>
          </div>
        </div>
      </div>
      {/*  */}
      <div className="flex flex-col gap-y-[5px] border-solid border-gray-300 py-[10px]">
        <span className="uppercase font-gray-200 font-bold text-xs">Followup</span>
        {followups.map((agent) => (
          <Agent {...agent} setAgents={setAgents} />
        ))}

        {followups.length < 1 && <NoneBox subject="followups" />}
      </div>
      <div className="flex flex-col gap-y-[5px] border-solid border-gray-300 py-[10px]">
        <span className="uppercase font-gray-200 font-bold text-xs">Commercial</span>
        {commercials.map((agent) => (
          <Agent {...agent} setAgents={setAgents} />
        ))}

        {commercials.length < 1 && <NoneBox subject="commercials" />}
      </div>
      {(commercials.length < 1 || followups.length < 1) && (
        <span
          onClick={toggleExpandedAdd}
          className={`${
            expandedAdd ? "text-red-600 hover:text-red-500" : "text-blue-400 hover:text-blue-500"
          } ml-2 text-base cursor-pointer`}>
          <i className={`fas fa-${expandedAdd ? "minus" : "plus"}`}></i>{" "}
          {expandedAdd ? tl("abort") : tl("add_member")}
        </span>
      )}
      {expandedAdd && (
        <form onSubmit={handleAddAgent}>
          <div className="my-4">
            <label className="capitalize text-gray-500 text-sm">{tl("role")}</label>
            <AutocompleteInput
              value={fields.role}
              onValueChange={(role) => setFields({ ...fields, role })}
              options={roleChoices}
              inputProps={{ placeholder: "Select Role" }}
              disabled={isLoading}
              required
            />
          </div>
          <div className="mb-4">
            <label className="capitalize text-gray-500 text-sm">{tl("name")}</label>
            <Input
              placeholder={tl("full_name")}
              value={fields.name}
              onValueChange={(name) => setFields({ ...fields, name })}
              disabled={isLoading}
              required
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-500 text-sm">{tl("phone")}</label>
            <Input
              value={fields.phone}
              placeholder={tl("phone")}
              type="tel"
              pattern="[0-9]*"
              onChange={(e) => {
                if (e.target.value.length > 10) return;
                if (!e.target.validity.valid && !!e.target.value) return;
                setFields({
                  ...fields,
                  phone: e.target.value,
                });
              }}
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-500 text-sm">{tl("password")}</label>
            <Input
              type="password"
              placeholder={tl("password")}
              value={fields.password}
              onValueChange={(password) => setFields({ ...fields, password })}
              disabled={isLoading}
              required
            />
          </div>
          <div className="mb-4">
            <Button
              label={tl("add_member")}
              btnColor="primary"
              type="submit"
              isLoading={isLoading}
            />
          </div>
        </form>
      )}
    </Card>
  );
};

function NoneBox({ subject = "items" }) {
  return (
    <div className="h-[100px] w-full border border-dashed border-gray-300 text-gray-500 text-sm flex items-center justify-center">
      No {subject}
    </div>
  );
}

function Agent({ _id, name, phone, role, setAgents }) {
  const tl = useTranslation();
  const [expandedEdit, setExpandedEdit] = useState(false);
  const [fields, setFields] = useState({ name, phone, role, password: "" });
  const [isLoading, setLoading] = useState(false);

  const confirmAction = useConfirmation();
  const showToast = useToast();

  function toggleExpandedEdit() {
    setExpandedEdit((expandedEdit) => {
      if (expandedEdit) {
        setFields({ name, phone, role, password: "" });
      }

      return !expandedEdit;
    });
  }

  async function handleUserEdit(e) {
    e.preventDefault();
    const changes = getDifferences({ name, phone, password: "" }, fields);
    if (Object.keys(changes).length < 1) return;
    setLoading(true);
    const { data, error } = await xFetch(`/tenants/agents/${_id}`, {
      method: "PATCH",
      body: changes,
    });
    setLoading(false);
    if (error || !data) return showToast(error, "error");
    showToast("success", "success");
    setAgents((agents) =>
      agents.map((agent) => {
        if (agent._id !== _id) return agent;
        return { ...agent, ...data };
      })
    );
    setExpandedEdit(false);
  }

  async function loginAsAgent() {
    setLoading(true);
    const { data, error } = await xLogin({ phone });
    setLoading(false);
    if (error) return showToast(error, "error");
    else if (data) window.location.replace("/account");
  }

  return (
    <div className="w-full bg-gray-100 text-gray-700 shadow-sm rounded-md p-3">
      <div className="flex items-center justify-between">
        <span className="pl-3">
          {name} ({phone})
        </span>
        <div>
          <IconButton
            icon="sign-in-alt"
            iconColor="green"
            className="ml-3"
            onClick={() =>
              confirmAction({ title: `${tl("login_as_user")} ${name}`, onConfirm: loginAsAgent })
            }
            disabled={isLoading}
          />
          <IconButton
            icon={expandedEdit ? "times" : "edit"}
            iconColor="gray"
            className="ml-3"
            onClick={toggleExpandedEdit}
            disabled={isLoading}
          />
        </div>
      </div>

      {expandedEdit && (
        <form onSubmit={handleUserEdit}>
          <div className="my-4">
            <Input
              placeholder={tl("full_name")}
              value={fields.name}
              onValueChange={(name) => setFields({ ...fields, name })}
              disabled={isLoading}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              placeholder={tl("phone")}
              value={fields.phone}
              onValueChange={(phone) => setFields({ ...fields, phone })}
              disabled={isLoading}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              type="password"
              placeholder={tl("password")}
              value={fields.password}
              onValueChange={(password) => setFields({ ...fields, password })}
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <Button
              label={tl("save_changes")}
              btnColor="secondary"
              type="submit"
              isLoading={isLoading}
            />
          </div>
        </form>
      )}
    </div>
  );
}
