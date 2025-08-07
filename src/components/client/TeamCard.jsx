import { useEffect, useState } from "react";
import { IconButton } from "../shared/Button";
import { Input } from "../shared/Input";
import { Button } from "../shared/Button";
import { useTranslation } from "../../i18n/provider";
import { xFetch } from "../../utils/constants";
import { useToast } from "../../hooks/useToast";
import { useConfirmation } from "../shared/ToolsProvider";
import { xLogin } from "../../utils/auth";
import { getDifferences } from "../../utils/misc";

export const TeamCard = () => {
  const tl = useTranslation();
  const [expandedAdd, setExpandedAdd] = useState(false);
  const [fields, setFields] = useState({ name: "", phone: "", password: "" });
  const [members, setMembers] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const showToast = useToast();

  function toggleExpandedAdd() {
    setExpandedAdd(expandedAdd => {
      if (expandedAdd) {
        setFields({ name: "", phone: "", password: "" });
      }

      return !expandedAdd;
    });
  }

  async function fetchMembers() {
    const { data, error } = await xFetch(`/clients/members`);
    setLoading(false);
    setMembers(data);
  }

  async function handleAddMember(e) {
    e.preventDefault();
    if (isLoading) return;
    setLoading(true);
    const { error, data } = await xFetch(`/clients/members`, { method: "POST", body: fields });
    setLoading(false);
    if (error) return showToast(error, "error");
    showToast("success", "success");
    setFields({ name: "", password: "", phone: "" });
    setMembers(members => [...members, data]);
    setExpandedAdd(false);
  }

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div
      className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 p-4 shadow-lg rounded-xl"
      style={{
        boxShadow: "0px 0px 30px rgba(16, 185, 129, 0.1), inset 0 -10px 15px 0 rgba(16, 185, 129, 0.2)",
      }}
    >
      <div className="relative w-full max-w-full grow flex-1 font-semibold text-xl">
        <span className="text-gray-700">{tl("team")}</span>
        <span
          onClick={toggleExpandedAdd}
          className={`${
            expandedAdd ? "text-red-600 hover:text-red-500" : "text-blue-400 hover:text-blue-500"
          } ml-2 text-base cursor-pointer`}
        >
          <i className={`fas fa-${expandedAdd ? "minus" : "plus"}`}></i> {expandedAdd ? tl("abort") : tl("add_member")}
        </span>
      </div>
      {expandedAdd && (
        <form onSubmit={handleAddMember}>
          <div className="my-4">
            <Input
              placeholder={tl("full_name")}
              value={fields.name}
              onValueChange={name => setFields({ ...fields, name })}
              disabled={isLoading}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              value={fields.phone}
              placeholder={tl("phone")}
              type="tel"
              pattern="[0-9]*"
              onChange={e => {
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
            <Input
              type="password"
              placeholder={tl("password")}
              value={fields.password}
              onValueChange={password => setFields({ ...fields, password })}
              disabled={isLoading}
              required
            />
          </div>
          <div className="mb-4">
            <Button label={tl("add_member")} btnColor="primary" type="submit" isLoading={isLoading} />
          </div>
        </form>
      )}
      {members.length > 0 && <span className="w-full border-b mb-4 mt-4"></span>}
      {!isLoading && members.map(member => <Member key={member._id} {...member} setMembers={setMembers} />)}
    </div>
  );
};

function Member({ _id, name, phone, setMembers }) {
  const tl = useTranslation();
  const [expandedEdit, setExpandedEdit] = useState(false);
  const [fields, setFields] = useState({ name, phone, password: "" });
  const [isLoading, setLoading] = useState(false);

  const confirmAction = useConfirmation();
  const showToast = useToast();

  function toggleExpandedEdit() {
    setExpandedEdit(expandedEdit => {
      if (expandedEdit) {
        setFields({ name, phone, password: "" });
      }

      return !expandedEdit;
    });
  }

  async function handleUserEdit(e) {
    e.preventDefault();
    const changes = getDifferences({ name, phone, password: "" }, fields);
    if (Object.keys(changes).length < 1) return;
    setLoading(true);
    const { data, error } = await xFetch(`/clients/members/${_id}`, {
      method: "PATCH",
      body: changes,
    });
    setLoading(false);
    if (error) return showToast(error, "error");
    showToast("success", "success");
    setMembers(members =>
      members.map(member => {
        if (member._id !== _id) return member;
        return { ...member, ...data };
      })
    );
    setExpandedEdit(false);
  }

  async function loginAsMember() {
    setLoading(true);
    const { data, error } = await xLogin({ phone });
    setLoading(false);
    if (error) return showToast(error, "error");
    else if (data) window.location.replace("/account");
  }

  return (
    <>
      <div className="mb-4 inline-flex items-center">
        <div className="w-full bg-gray-100 text-gray-700 shadow-sm h-12 rounded-full flex items-center justify-between">
          <span className="pl-3">
            {name} ({phone})
          </span>
          <IconButton
            icon="sign-in-alt"
            iconColor="green"
            className="ml-3"
            onClick={() => confirmAction({ title: `${tl("login_as_user")} ${name}`, onConfirm: loginAsMember })}
            disabled={isLoading}
          />
        </div>
        <IconButton
          icon={expandedEdit ? "times" : "edit"}
          iconColor="gray"
          className="ml-3"
          onClick={toggleExpandedEdit}
          disabled={isLoading}
        />
      </div>
      {expandedEdit && (
        <form onSubmit={handleUserEdit}>
          <div className="mb-4">
            <Input
              placeholder={tl("full_name")}
              value={fields.name}
              onValueChange={name => setFields({ ...fields, name })}
              disabled={isLoading}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              placeholder={tl("phone")}
              value={fields.phone}
              onValueChange={phone => setFields({ ...fields, phone })}
              disabled={isLoading}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              type="password"
              placeholder={tl("password")}
              value={fields.password}
              onValueChange={password => setFields({ ...fields, password })}
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <Button label={tl("save_changes")} btnColor="secondary" type="submit" isLoading={isLoading} />
          </div>
        </form>
      )}
    </>
  );
}
