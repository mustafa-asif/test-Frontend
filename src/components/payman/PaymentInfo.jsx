import { Fragment, useEffect, useState } from "react";
import { useQuickEditor } from "../shared/ToolsProvider";
import { cl } from "../../utils/misc";

export const PaymentInfo = ({ cycle_id, payment_info, disabled }) => {
  const [isSaving, editDocument] = useQuickEditor(cycle_id, "clientCycles");
  const [state, setState] = useState(payment_info ? "view" : "none");
  const [scratchInfo, setScratchInfo] = useState(payment_info || "");

  function startEdit(e) {
    if (disabled) return;
    if (state !== "none" && state !== "view") return;
    setState("edit");
  }

  async function handleSave() {
    if (disabled) return;

    if (isSaving || !scratchInfo.replaceAll(" ", "")) return;
    setState("view");
    if (payment_info === scratchInfo) {
      setState("view");
      return;
    }
    await editDocument({ payment_info: scratchInfo });
  }
  async function handleAbort() {
    if (isSaving) return;
    setState(payment_info ? "view" : "none");
    setScratchInfo(payment_info || "");
  }

  function handleKeyDown(e) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    handleSave();
  }

  useEffect(() => {
    if (payment_info && state !== "edit") {
      setScratchInfo(payment_info);
    }
  }, [payment_info]);

  return (
    <div
      className={cl(
        "flex gap-x-[5px] h-[30px] w-full px-[10px] py-[4px] rounded-full transition-all duration-300 active:shadow-none border-2",
        {
          "bg-red-200 border-dashed border-red-500 justify-center items-center hover:animate-none select-none":
            state === "none",
        },
        { "animate-pulse cursor-pointer": state === "none" && !disabled },
        { "justify-between items-center border-transparent": state === "edit" },
        { "bg-red-200": state === "edit" && !payment_info },
        { "bg-gray-200": state === "edit" && payment_info },
        { "bg-gray-200 border-gray-300 justify-between items-center": state === "view" },
        { "pointer-effects-none opacity-80": disabled }
      )}
      onClick={state === "none" ? startEdit : undefined}>
      {state === "none" && (
        <Fragment>
          {/* <i className="fas fa-plus text-sm mr-[5px]"></i> */}
          <span className="font-medium text-sm">références paiement</span>
        </Fragment>
      )}
      {state === "edit" && (
        <Fragment>
          <input
            className={cl(
              "bg-transparent appearance-none outline-none border-b-2 border-b-black flex-1 text-sm",
              { "opacity-70 pointer-events-none": isSaving }
            )}
            value={scratchInfo}
            onChange={(e) => setScratchInfo(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="références paiement"
            disabled={isSaving}
          />
          <button
            className={cl(
              "w-[30px] h-[20px] bg-white hover:bg-gray-100 active:shadow-none active:bg-gray-200 rounded-full flex items-center justify-center text-sm",
              { "opacity-70 pointer-events-none": isSaving }
            )}
            onClick={handleSave}>
            <i className="fas fa-check"></i>
          </button>
          <button
            className={cl(
              "w-[20px] h-[20px] hover:bg-white/30 rounded-full flex items-center justify-center text-sm",
              { "opacity-70 pointer-events-none": isSaving }
            )}
            onClick={handleAbort}>
            <i className="fas fa-times"></i>
          </button>
        </Fragment>
      )}

      {state === "view" && (
        <Fragment>
          {!payment_info && isSaving && <span className="text-sm text-center">...</span>}
          {payment_info && !isSaving && (
            <span className="text-sm border-b-2 border-transparent">{payment_info}</span>
          )}
          {!isSaving && (
            <Fragment>
              {!payment_info && <span className="text-sm">-</span>}
              <button
                className={cl(
                  "w-[30px] h-[20px] bg-white hover:bg-gray-100 active:shadow-none active:bg-gray-200 rounded-full flex items-center justify-center text-sm",
                  { "opacity-70 pointer-events-none": isSaving },
                  { "hidden ": disabled }
                )}
                onClick={startEdit}>
                <i className="fas fa-pen"></i>
              </button>
            </Fragment>
          )}
        </Fragment>
      )}
    </div>
  );
};
