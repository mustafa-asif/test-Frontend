import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { Button, IconButton } from "../shared/Button";
import { Card } from "../shared/Card";
import { Copyable } from "../shared/Copyable";
import { HumanDate } from "../shared/HumanDate";
import { useConfirmation, useQuickEditor } from "../shared/ToolsProvider";

export const SupportCategoryCard = ({ _id, target, category, sub_categories, active, date_created }) => {
  const [isLoading, setLoading] = useState(false);
  const [isSaving, editDocument, deleteDocument] = useQuickEditor(_id, "supportCategories");

  const confirmAction = useConfirmation();
  const showToast = useToast();

  return (
    <Card loading={isLoading}>
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-full text-sm font-light text-gray-400 hover:text-green-500 flex items-center col-span-2 -mt-1 cursor-pointer">
          <Copyable text={_id} />
        </div>
        <div className="rounded-full text-sm font-light text-gray-400 flex items-center col-span-2 justify-end -mt-1">
          <HumanDate date={date_created} long />
        </div>
        {/*  */}
        <div className="col-span-4 flex gap-x-2 border-b border-gray-100 py-2">
          <p className="uppercase font-bold text-gray-600">roles</p>
          {target.user_roles?.length > 0 ? (
            target.user_roles.map((role) => (
              <span
                key={role}
                className="h-6 w-max px-2 rounded-full bg-green-50 text-green-500 border border-solid border-green-100 flex items-center justify-center">
                {role}
              </span>
            ))
          ) : (
            <span className="h-6 w-max px-2 rounded-full bg-green-50 text-green-500 border border-solid border-green-100 flex items-center justify-center">
              -
            </span>
          )}
        </div>
    
        <div className="col-span-4 flex gap-x-2 border-b border-gray-100 py-2">
          <p className="uppercase font-bold text-gray-600">Pages</p>
          {target.pages?.length > 0 ? (
            target.pages.map((path) => (
              <span
                key={path}
                className="h-6 w-max px-2 rounded-full bg-gray-50 text-gray-500 border border-solid border-gray-100 flex items-center justify-center">
                {path}
              </span>
            ))
          ) : (
            <span className="h-6 w-max px-2 rounded-full bg-gray-50 text-gray-500 border border-solid border-gray-100 flex items-center justify-center">
              -
            </span>
          )}
        </div>
        {/*  */}
        <div className="col-span-4 flex gap-x-2 border-b border-gray-100 py-2">
          <p className="uppercase font-bold text-gray-600">Category</p>
          <span className="text-gray-500">{category}</span>
        </div>
        <div className="col-span-4 flex gap-x-2 border-b border-gray-100 py-2">
          <p className="uppercase font-bold text-gray-600">Sub-Categories</p>
          {sub_categories.map((sub_category) => <span key={sub_category} className="text-gray-500">{sub_category},</span>)}
        </div>
        {/*  */}

        <div className="col-span-4 flex items-center gap-x-3">
          <ActiveCircle
            active={active}
            loading={isSaving}
            onActivate={() => editDocument({ active: true })}
            onDeactivate={() => editDocument({ active: false })}
          />
          <Link to={`/support-categories/${_id}/edit`} className="flex-1">
            <Button btnColor="gray" icon="pen" className="h-10" />
          </Link>
          <IconButton
            icon="trash"
            onClick={() => confirmAction({ onConfirm: deleteDocument, title: "Are you sure?" })}
            disabled={isLoading}
            iconColor="red"
          />
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
        className={`uppercase font-semibold ${loading ? "text-gray-600" : active ? "text-green-500" : "text-red-500"
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
