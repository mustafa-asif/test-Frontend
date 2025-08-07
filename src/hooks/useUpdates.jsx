import { useStoreState, useStoreActions } from "easy-peasy";
import { useEffect, useRef } from "react";
import { useSocket } from "../components/shared/SocketProvider";

export const useUpdates = (model) => {
  const user = useStoreState((state) => state.auth.user);
  const socket = useSocket();

  const document_ids = useStoreState((state) => state[model]?.[model]?.map((doc) => doc._id));

  const isListening = useStoreState((state) => state[model]?.listening);
  const setListening = useStoreActions((actions) => actions[model]?.setListening);

  const updateDocument = useStoreActions(
    (actions) => actions[model]?.[`update${model[0].toUpperCase() + model.slice(1, -1)}`]
  );
  const replaceDocument = useStoreActions(
    (actions) => actions[model]?.[`replace${model[0].toUpperCase() + model.slice(1, -1)}`]
  );

  const removeDocument = useStoreActions(
    (actions) => actions[model]?.[`remove${model[0].toUpperCase() + model.slice(1, -1)}`]
  );

  const addDocument = useStoreActions(
    (actions) => actions[model]?.[`add${model[0].toUpperCase() + model.slice(1, -1)}`]
  );

  let listening = useRef([]).current;

  useEffect(() => {
    // console.log("documents changed");

    const not_viewing_anymore = listening
      .filter((id) => !document_ids.includes(id))
      .map((id) => model + ":" + id);
    const new_viewing = document_ids
      .filter((id) => !listening.includes(id))
      .map((id) => model + ":" + id);

    if (not_viewing_anymore.length) {
      socket.emit("unwatch", not_viewing_anymore, (res) => {
        // console.log(res);
      });
    }
    if (new_viewing.length) {
      console.log("new docs starting watch");
      socket.emit("watch", new_viewing, (res) => {
        // console.log(res);
        console.log("response from server ..", res);
      });
    }

    // console.log("no longer viewing: ", not_viewing_anymore.join(", "));
    // console.log("new viewing: ", new_viewing.join(", "));

    listening = document_ids;
  }, [document_ids.join("")]);

  function handleDocumentInsert(data) {
    console.log(data);
    addDocument(data.fullDocument);
  }

  function handleDocumentUpdate(data) {
    console.log(data);
    // serverside send a delete event if shouldStopListening.
    updateDocument({ _id: data._id, updateDescription: data.updateDescription });
  }

  function handleDocumentReplace(data) {
    console.log(data);
    // serverside send a delete event if shouldStopListening.
    replaceDocument({ _id: data._id, data: data.fullDocument });
  }

  function handleDocumentDelete(data) {
    console.log(data);
    removeDocument(data._id);
  }

  return function () {
    if (isListening) return console.log(`already registered listeners for model ${model}`);
    if (!setListening) return console.log(`setListening not found for model ${model}`);

    socket.on(model + "-insert", handleDocumentInsert);
    socket.on(model + "-update", handleDocumentUpdate);
    socket.on(model + "-replace", handleDocumentReplace);
    socket.on(model + "-delete", handleDocumentDelete);
    setListening(true);
  };
};
