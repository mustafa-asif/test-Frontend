export const useDocumentsLoader = (model, increments = 3, filter, setFilter) => {
  const showToast = useToast();
  const startListeningWS = useUpdates(model);

  const documents_length = useStoreState((state) => state[model][model].length);
  const documents_loading = useStoreState((state) => state[model].loading);

  const addDocuments = useStoreActions(
    (actions) => actions[model][`add${model[0].toUpperCase() + model.slice(1)}`]
  );
  const setDocuments = useStoreActions(
    (actions) => actions[model][`set${model[0].toUpperCase() + model.slice(1)}`]
  );
};
