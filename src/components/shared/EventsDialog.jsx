import { Dialog } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useStoreActions, useStoreState } from "easy-peasy";
import { useEffect, useState } from "react";
import { xFetch } from "../../utils/constants";
import { IconButton } from "./Button";
import { ErrorView } from "./ErrorView";
import { EventsView } from "./EventsView";
import { useBackClose } from "./LastLocation";
import { LoadingView } from "./LoadingView";

export const EventsDialog = ({ model, id, ...props }) => {
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(null);
  const fullScreen = useMediaQuery("(max-width:768px)");
  const addEvents = useStoreActions((actions) => actions[model].addEvents);

  const doc = useStoreState((state) => state[model][model]?.find((doc) => doc._id === id));
  const events = doc?.events;

  const fetchEvents = async () => {
    setError(null);
    const { data, error } = await xFetch(`/${model}/${id}/events`);
    setLoading(false);
    if (error) {
      return setError(error);
    }
    addEvents({ _id: id, events: data, prepend: true, override: true });
  };

  useEffect(() => {
    if (!props.open) {
      setLoading(true);
      setError(null);
    } else if (model && id) {
      fetchEvents();
    }
  }, [props.open, model, id]);

  const handleDrawerClose = useBackClose("/" + model);

  const content = (() => {
    if (isLoading) return <LoadingView />;
    if (!events) return <ErrorView text={isError} />;
    return (
      <EventsView
        model={model}
        _id={id}
        events={events}
        handleDrawerClose={handleDrawerClose}
        status={doc?.status}
      />
    );
  })();

  return (
    <Dialog {...props} onClose={handleDrawerClose} fullScreen={fullScreen}>
      <IconButton
        icon="times"
        onClick={handleDrawerClose}
        className="absolute right-5 top-3 md:hidden z-40 text-gray-800"
        iconColor="gray"
      />
      {content}
    </Dialog>
  );
};
