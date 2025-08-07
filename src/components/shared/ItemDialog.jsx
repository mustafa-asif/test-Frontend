import { Dialog } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import { xFetch } from "../../utils/constants";
import { IconButton } from "./Button";
import { ErrorView } from "./ErrorView";
import { ItemView } from "./ItemView";
import { LoadingView } from "./LoadingView";

export const ItemDialog = ({ _id, setItemDialog, ...props }) => {
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(null);
  const [item, setItem] = useState(null);
  const fullScreen = useMediaQuery('(max-width:768px)');

  const fetchItem = async () => {
    setError(null);
    const { data, error } = await xFetch(`/items/${_id}`, undefined, undefined, undefined, [
      `populate_client=true`,
    ]);
    setLoading(false);
    if (error) {
      return setError(error);
    }
    setItem(data);
  };

  useEffect(() => {
    if (!props.open) {
      setLoading(true);
      setError(null);
    } else {
      fetchItem();
    }
  }, [props.open]);

  const content = (() => {
    if (isLoading) return <LoadingView />;
    if (!item) return <ErrorView text={isError || "could not find item"} />;
    return <ItemView {...item} />;
  })();

  return <Dialog {...props} fullScreen={fullScreen}>
    <IconButton
      icon="times"
      onClick={props.onClose}
      className="absolute right-5 top-3 md:hidden z-40 text-gray-800"
      iconColor="gray"
    />
    {content}
  </Dialog>;
};
