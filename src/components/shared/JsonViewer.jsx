import { Dialog, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { xFetch } from "../../utils/constants";
import { cl } from "../../utils/misc";
import { IconButton } from "./Button";
import { ErrorView } from "./ErrorView";
import { LoadingView } from "./LoadingView";
import { useJsonViewer } from "./ToolsProvider";
import JSONPretty from "react-json-pretty";
import JSONTheme from "react-json-pretty/dist/acai";

export const JsonViewer = ({ model, _id, open, onClose }) => {
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(null);
  const [data, setData] = useState(null);
  const fullScreen = useMediaQuery("(max-width:768px)");

  const fetchData = async () => {
    setError(null);
    const { data, error } = await xFetch(`/${model}/${_id}`);
    setLoading(false);
    if (error) {
      return setError(error);
    }
    setData(data);
  };

  useEffect(() => {
    if (!open) {
      setLoading(true);
      setError(null);
    } else {
      fetchData();
    }
  }, [open]);

  const content = (() => {
    if (isLoading) return <LoadingView />;
    if (!data) return <ErrorView text={isError || "could not find data"} />;
    return <JSONPretty theme={JSONTheme} data={data} mainStyle="padding:1em"></JSONPretty>;
  })();

  return (
    <Dialog open={open} onClose={onClose} fullScreen={fullScreen}>
      <IconButton
        icon="times"
        onClick={onClose}
        className="absolute right-5 top-3 md:hidden z-40 text-gray-800"
        iconColor="gray"
      />
      {content}
    </Dialog>
  );
};

export const JsonViewButton = ({ model, _id, disabled }) => {
  const showJson = useJsonViewer();
  function handleClick() {
    if (disabled) return;
    showJson({ _id, model });
  }
  return (
    <div
      className={cl(
        "font-bold ml-2 bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center",
        { "cursor-pointer text-blue-500": !disabled },
        { "cursor-default text-gray-200 hover:text-blue-700 hover:shadow-md": disabled }
      )}
      onClick={handleClick}>
      {"{.."}
    </div>
  );
};
