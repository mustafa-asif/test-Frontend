import { Dialog } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import { xFetch } from "../../utils/constants";
import { IconButton } from "./Button";
import { DocumentView } from "./DocumentView";
import { ErrorView } from "./ErrorView";
import { LoadingView } from "./LoadingView";

export const DocumentDialog = ({ model, id, ...props }) => {
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(null);
  const [document, setDocument] = useState(null);
  const fullScreen = useMediaQuery("(max-width:768px)");

  const fetchDocument = async () => {
    setError(null);
    const { data, error } = await xFetch(`/${model}/${id}`);
    setLoading(false);
    if (error) {
      return setError(error);
    }
    setDocument(data);
  };

  useEffect(() => {
    if (!props.open) {
      setLoading(true);
      setError(null);
      setDocument(null);
    } else {
      fetchDocument();
    }
  }, [props.open]);

  const content = (() => {
    if (isLoading) return <LoadingView />;
    if (!document) return <ErrorView text={isError || `could not find ${model.slice(-1)}`} />;
    return <DocumentView model={model} document={document} />;
  })();

  return (
    <Dialog {...props} fullScreen={fullScreen}>
      <IconButton
        icon="times"
        onClick={props.onClose}
        className="absolute right-5 top-3 md:hidden z-40 text-gray-800"
        iconColor="gray"
      />
      {content}
    </Dialog>
  );
};
