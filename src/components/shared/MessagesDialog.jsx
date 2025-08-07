import { Dialog } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useStoreActions, useStoreState } from "easy-peasy";
import { useEffect, useState } from "react";
import { xFetch } from "../../utils/constants";
import { IconButton } from "./Button";
import { ErrorView } from "./ErrorView";
import { useBackClose } from "./LastLocation";
import { LoadingView } from "./LoadingView";
import { MessagesView } from "./MessagesView";

export const MessagesDialog = ({ model, id, ...props }) => {

  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(null);
  const fullScreen = useMediaQuery("(max-width:768px)");

  let model_to_fetch = model === "returns" ? "purges" : model;

  const addMessages = useStoreActions((actions) => actions[model_to_fetch].addMessages);
  const [supportCategories, setSupportCategories] = useState([]);

  const user_id = useStoreState((state) => state.auth.user._id);
  const doc = useStoreState((state) => state[model_to_fetch][model_to_fetch]?.find((doc) => doc._id === id));
  const fetchMessages = async () => {
    setError(null);
    const { data, error } = await xFetch(`/${model_to_fetch}/${id}/messages`);
    setLoading(false);
    if (error) {
      return setError(error);
    }
    addMessages({
      _id: id,
      messages: data,
      prepend: true,
      override: true,
    });
  };

  useEffect(() => {
    if (!props.open) {
      setLoading(true);
      setError(null);
    } else if (model && id && !!doc) {
      fetchMessages();
    }
  }, [props.open, id, model, !!doc]);

  useEffect(() => {
    fetchPageSupportCategories();
  }, [model]);

  async function fetchPageSupportCategories() {
    const { data, error } = await xFetch(`/supportCategories/matching`, undefined, undefined, undefined, [
      `page_path=/${model_to_fetch}`,
    ]);
    setLoading(false);
    if (error) console.log(error, "failed to get support categories");
    else {
      let formattedSupportCategories = {};
      data.forEach(supportCategory =>
        formattedSupportCategories[supportCategory.category] = supportCategory.sub_categories
      );
      setSupportCategories(formattedSupportCategories);
    }
  }

  useEffect(() => {
    markSeenMessages();
  }, [doc?.messages.length]);

  async function markSeenMessages() {
    const unseenMessages = doc?.messages?.filter(
      (msg) => !msg.seen.some((seen) => seen.user._id === user_id)
    );
    if (!unseenMessages?.length) return console.log("seen all");
    const { error } = await xFetch(`/${model_to_fetch}/${id}/messages`, {
      method: "PATCH",
      body: { messages: unseenMessages.map((msg) => msg._id) },
    });
    if (error) console.error("failed to mark messages as seen. ", error);
  }

  const handleDrawerClose = useBackClose("/" + model);

  const content = (() => {
    if (isLoading) return <LoadingView />;
    if (!doc?.messages) return <ErrorView text={isError} />;
    return (
      <MessagesView
        pinned={doc?.pinned}
        model={model_to_fetch}
        _id={id}
        messages={doc?.messages}
        tags={doc?.tags}
        status={doc?.status}
        rating={doc?.rating}
        isFullScreen={fullScreen}
        warehouseCity={doc?.warehouse?.city}
        deliverer={doc?.deliverer}
        supportCategories={supportCategories}
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
