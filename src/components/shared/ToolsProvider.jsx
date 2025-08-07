import { createContext, useContext, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { xFetch } from "../../utils/constants";
import { AddItemsDialog } from "./AddItemsDialog";
import { ConfirmationComponent } from "./Confirmation";
import { ItemDialog } from "./ItemDialog";
import { PrintComponent } from "./Print";
import { ScanComponent } from "./ScanComponent";
import { SeeItemsDialog } from "./SeeItemsDialog";
import { useTranslation } from "../../i18n/provider";
import { JsonViewer } from "./JsonViewer";
import { DocumentDialog } from "./DocumentDialog";
import { SelectWarehouseComponent } from "./SelectWarehouse";

const initialState = {
  item: { _id: null },
  confirm: {
    onConfirm: null,
    title: null,
    icon: null,
    color: "green-500",
  },
  print: {
    items: [],
    onPrint: undefined,
  },
  see_items: {
    products: [],
    items: [],
  },
  items: {
    products: [],
    onFinish: undefined,
    onSuccess: undefined,
    items: [],
    title: "",
    expected_items_count: undefined,
    hint: undefined,
  },
  see_document: {
    model: null,
    _id: null,
  },
  scan: {
    onData: (data) => {},
    fetchDocument: true,
    allowedModels: [],
  },
  saving: [],
  selecting_model: null,
  selected: [],
  json_view: {
    model: null,
    _id: null,
  },
  view_style: localStorage.getItem("view_style") || "card",
  warehouseSelect: {
    callback: null,
  },
};

const ToolsContext = createContext({
  showConfirmation: ({ onConfirm, title = undefined, icon = undefined, color = undefined }) => {},
  showPrint: (items, options = { onPrint: undefined }) => {},
  showItemsAdd: ({
    onFinish,
    onSuccess,
    products,
    title,
    city,
    expected_items_count,
    hint: {},
    client,
  }) => {},
  showScan: ({ onData, fetchDocument, allowedModels }) => {},
  toggleSaving: (id, boolean) => {},
  toggleSelected: (id, boolean) => {},
  showItem: (id) => {},
  seeItems: ({ products, items }) => {},
  seeDocument: ({ model, _id }) => {},
  showJson: ({ model, _id }) => {},
  selectWarehouse: ({ callback }) => {},
  saving: [],
  selected: [],
  selecting_model: null,
  setSelectingModel: (model) => {},
  setViewStyle: (style) => {},
  viewStyle: localStorage.getItem("view_style") || "card",
});

export const ToolsProvider = ({ children }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmState, setConfirmState] = useState(initialState.confirm);

  const [printOpen, setPrintOpen] = useState(false);
  const [printState, setPrintState] = useState(initialState.print);

  const [itemsAddOpen, setItemsAddOpen] = useState(false);
  const [itemsAddState, setItemsAddState] = useState(initialState.items);

  const [scanOpen, setScanOpen] = useState(false);
  const [scanState, setScanState] = useState(initialState.scan);

  const [seeItemsOpen, setSeeItemsOpen] = useState(false);
  const [seeItemsState, setSeeItemsState] = useState(initialState.see_items);

  const [seeDocumentState, setSeeDocumentState] = useState(initialState.see_document);

  const [itemDialog, setItemDialog] = useState(initialState.item);

  const [jsonOpen, setJsonOpen] = useState(false);
  const [jsonViewer, setJsonViewer] = useState(initialState.json_view);

  const [warehouseSelectState, setWarehouseSelectState] = useState(initialState.warehouseSelect);

  const [saving, setSaving] = useState(initialState.saving);

  const [selectingModel, _setSelectingModel] = useState(initialState.selecting_model);
  const [selected, setSelected] = useState(initialState.selected);

  const [viewStyle, _setViewStyle] = useState(initialState.view_style);

  function showConfirmation(args) {
    setConfirmState({ ...confirmState, ...args });
    setConfirmOpen(true);
  }

  function showPrint(items, options = {}) {
    options.onPrint ??= undefined;
    setPrintState({ ...printState, items, ...options });
    setPrintOpen(true);
  }

  function showItemsAdd(args) {
    setItemsAddState({
      products: args.products || [],
      items: args.items || [],
      title: args.title || "Add Items",
      city: args.city,
      client: args.client,
      expected_items_count: args.expected_items_count,
      onFinish: args.onFinish || function () {},
      onSuccess: args.onSuccess || function () {},
      hint: args.hint || {},
    });
    setItemsAddOpen(true);
  }

  function showScan(args) {
    setScanState({ ...args });
    setScanOpen(true);
  }

  function toggleSaving(id, value) {
    if (value) return setSaving([...saving, id]);
    else return setSaving(saving.filter((_id) => _id !== id));
  }

  function toggleSelected(id, value) {
    if (value) return setSelected([...selected, id]);
    else return setSelected(selected.filter((_id) => _id !== id));
  }

  function setSelectingModel(model) {
    if (!model || model !== selectingModel) setSelected([]);
    console.log("setting selected model " + model);
    _setSelectingModel(model);
  }

  function showItem(_id) {
    setItemDialog({ _id });
  }

  function seeItems(args) {
    setSeeItemsState({ products: args.products, items: args.items });
    setSeeItemsOpen(true);
  }

  function showJson(args) {
    setJsonViewer(args);
    setJsonOpen(true);
  }
  function seeDocument(args) {
    setSeeDocumentState(args);
  }

  function setViewStyle(style) {
    localStorage.setItem("view_style", style);
    _setViewStyle(style);
  }

  function selectWarehouse({ callback }) {
    setWarehouseSelectState({ callback });
  }

  return (
    <ToolsContext.Provider
      value={{
        showConfirmation,
        showPrint,
        showItemsAdd,
        toggleSaving,
        toggleSelected,
        showScan,
        showItem,
        seeItems,
        showJson,
        seeDocument,
        setViewStyle,
        setSelectingModel,
        selectWarehouse,
        viewStyle,
        saving,
        selected,
        selectingModel,
      }}>
      {children}
      <ConfirmationComponent isOpen={confirmOpen} setOpen={setConfirmOpen} state={confirmState} />
      <AddItemsDialog
        isOpen={itemsAddOpen}
        setOpen={setItemsAddOpen}
        state={itemsAddState}
        setItems={(func) => setItemsAddState((state) => ({ ...state, items: func(state.items) }))}
      />
      <ScanComponent isOpen={scanOpen} setOpen={setScanOpen} state={scanState} />
      <PrintComponent
        isOpen={printOpen}
        onClose={() => {
          setPrintOpen(false);
          setPrintState(initialState.print);
        }}
        state={printState}
      />
      <ItemDialog
        _id={itemDialog._id}
        open={!!itemDialog._id}
        onClose={() => setItemDialog({ _id: null })}
        setItemDialog
      />

      <DocumentDialog
        id={seeDocumentState._id}
        model={seeDocumentState.model}
        open={!!seeDocumentState._id}
        onClose={() => setSeeDocumentState({ _id: null, model: null })}
      />
      <SeeItemsDialog
        products={seeItemsState.products}
        items={seeItemsState.items}
        open={seeItemsOpen}
        onClose={() => setSeeItemsOpen(false)}
      />
      <JsonViewer
        open={jsonOpen}
        onClose={() => setJsonOpen(false)}
        model={jsonViewer.model}
        _id={jsonViewer._id}
      />
      <SelectWarehouseComponent
        isOpen={!!warehouseSelectState.callback}
        onClose={() => setWarehouseSelectState({ callback: null })}
        state={warehouseSelectState}
      />
    </ToolsContext.Provider>
  );
};

export const useConfirmation = () => {
  return useContext(ToolsContext).showConfirmation;
};

export const useScan = (args) => {
  const showScan = useContext(ToolsContext).showScan;
  return function () {
    showScan(args);
  };
};

export const useItemsAdd = () => {
  return useContext(ToolsContext).showItemsAdd;
};

export const usePrint = () => {
  return useContext(ToolsContext).showPrint;
};

export const useShowItem = () => {
  return useContext(ToolsContext).showItem;
};

export const useSeeItems = (args) => {
  const seeItems = useContext(ToolsContext).seeItems;
  return function () {
    return seeItems(args);
  };
};

export const useSaving = (id) => {
  const { saving, toggleSaving } = useContext(ToolsContext);
  const isSaving = saving.includes(id);
  function setSaving(value) {
    return toggleSaving(id, value);
  }
  return [isSaving, setSaving];
};

export const useJsonViewer = () => {
  return useContext(ToolsContext).showJson;
};

export const useSelectWarehouse = () => {
  return useContext(ToolsContext).selectWarehouse;
};

export const useQuickEditor = (id, model) => {
  const showToast = useToast();
  const [isSaving, setSaving] = useSaving(id);
  const confirmAction = useConfirmation();
  const showAddItems = useItemsAdd();
  const tl = useTranslation();

  async function editFunction(changes) {
    if (isSaving) return;
    setSaving(true);
    let route = `/${model}/${id}`;
    if (model === "orders" && changes.deliverer_id) {
      route = `/alternatives/deliver/${id}`;
    }
    const { error } = await xFetch(route, { method: "PATCH", body: changes });
    setSaving(false);
    if (error) {
      showToast(error, "error");
      return false;
    }
    showToast("success", "success");
    return true;
  }

  async function deleteFunction() {
    if (isSaving) return;
    setSaving(true);
    const { error } = await xFetch(`/${model}/${id}`, { method: "DELETE" });
    setSaving(false);
    if (error) {
      showToast(error, "error");
      return false;
    }
    showToast("success", "success");
    return true;
  }

  function editDoc(changes, confirmType = undefined, callback = undefined, args = undefined) {
    if (isSaving) return;
    if (confirmType === "confirm") {
      return confirmAction({
        title: `Modifier ${tl(model.slice(0, -1))} ${id}`,
        onConfirm: async () => {
          const res = await editFunction(changes);
          if (res) callback?.();
          return res;
        },
      });
    }
    if (confirmType === "items") {
      return showAddItems({
        onFinish: (items, extra_args = {}) =>
          editFunction({ ...changes, items: items?.map((it) => it._id), ...extra_args }),
        ...args,
      });
    }
    return editFunction(changes);
  }

  function deleteDoc(confirmType = "confirm") {
    if (isSaving) return;
    if (confirmType === "confirm") {
      return confirmAction({
        title: `Supprimer ${tl(model.slice(0, -1))} ${id}`,
        onConfirm: () => deleteFunction(),
      });
    }
    return deleteFunction();
  }

  async function customEditDoc(func, successCallback) {
    if (isSaving) return;
    setSaving(true);
    const { error, data } = await func();
    setSaving(false);
    if (error) {
      showToast(error, "error");
      return false;
    }
    successCallback(data);
    showToast("success", "success");
    return true;
  }

  return [isSaving, editDoc, deleteDoc, customEditDoc];
};

export function useSeeDocument() {
  return useContext(ToolsContext).seeDocument;
}

export const useViewStyle = () => {
  const { viewStyle, setViewStyle } = useContext(ToolsContext);
  return { viewStyle, setViewStyle };
};

export const useSelectingModel = (model) => {
  const { selectingModel, setSelectingModel } = useContext(ToolsContext);
  const isSelected = selectingModel === model;
  function toggleSelected() {
    return setSelectingModel(isSelected ? null : model);
  }
  return { isSelected, toggleSelected };
};

export const useSelected = (id, model) => {
  const { selected, selectingModel, toggleSelected } = useContext(ToolsContext);
  const isSelecting = selectingModel === model;
  const isSelected = isSelecting && selected.includes(id);
  function setSelected(value) {
    if (selectingModel !== model) return;
    return toggleSelected(id, value);
  }
  return [isSelected, setSelected, isSelecting];
};

export const useSelecting = () => {
  const { selected, selectingModel, setSelectingModel } = useContext(ToolsContext);
  return { selected, selectingModel, setSelectingModel };
};
