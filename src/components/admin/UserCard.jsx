import { useState } from "react";
import { Button, IconButton } from "../shared/Button";
import { Card } from "../shared/Card";
import { Copyable } from "../shared/Copyable";
import { Pic } from "../shared/Pic";
import { HumanDate } from "../shared/HumanDate";
import { useConfirmation } from "../shared/ToolsProvider";
import { xLogin } from "../../utils/auth";
import { useToast } from "../../hooks/useToast";
import { Link } from "react-router-dom";

export const UserCard = ({
  _id,
  image,
  name,
  phone,
  role,
  timestamps,
  isMainUser,
  ...additional
}) => {
  const confirmAction = useConfirmation();
  const [isLoading, setLoading] = useState(false);
  const showToast = useToast();

  async function loginAsUser() {
    setLoading(true);
    const { data, error } = await xLogin({ phone });
    setLoading(false);
    if (error) return showToast(error, "error");
    else if (data) {
      window.location.replace("/");
    }
  }

  const tenantData = (() => {
    if (role === "client") return additional.client.tenant;
    if (role === "tenant") return additional.tenant;
  })();

  return (
    <Card loading={isLoading}>
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-full text-sm font-light text-gray-400 hover:text-green-500 flex items-center col-span-2 -mt-1 cursor-pointer">
          <Copyable text={_id} />
        </div>
        <div className="rounded-full text-sm font-light text-gray-400 flex items-center col-span-2 justify-end -mt-1">
          <HumanDate date={timestamps?.created} long />
        </div>
        <div className="rounded-full h-10 text-sm font-semibold flex items-center col-span-3">
          <Pic image={image} className="mr-1" />
          <span className="line-clamp-2">{name}</span>
          <span className="ml-1 h-6 min-w-6 px-1 rounded-full bg-green-50 text-green-500 border border-solid border-green-100 flex items-center justify-center">
            {role}
          </span>
          {isMainUser && (
            <span className="ml-1 h-6 min-w-6 px-1 rounded-full bg-red-50 text-red-500 border border-solid border-red-100 flex items-center justify-center">
              <i className="fas fa-crown"></i>
            </span>
          )}
          {tenantData && (
            <span className="ml-1 h-6 min-w-6 px-1 rounded-full bg-blue-50 text-blue-500 border border-solid border-blue-100 flex items-center justify-center">
              {tenantData.domain}
            </span>
          )}
        </div>
        <div className="col-span-4 gap-x-2 flex">
          <Button
            className=""
            icon="user"
            label="Login as User"
            type="button"
            onClick={() => confirmAction({ title: `Login as ${name}`, onConfirm: loginAsUser })}
          />
          <Link to={`/users/${_id}/edit`}>
            <IconButton className="!bg-gray-700" size="md" iconColor="white " icon="pen" />
          </Link>
        </div>
      </div>
    </Card>
  );
};
