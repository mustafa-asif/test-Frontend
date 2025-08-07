import { Dialog } from "@mui/material";
import { useTranslation } from "../../i18n/provider";

export const ConfirmationComponent = ({ isOpen, state, setOpen }) => {
  const tl = useTranslation();
  function handleClose() {
    setOpen(false);
  }

  function handleConfirm() {
    setOpen(false);
    state.onConfirm?.();
  }

  return (
    <Dialog onClose={handleClose} open={isOpen}>
      <div className="flex flex-col overflow-y-scroll rounded-md bg-white text-xl p-6" id="red">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="col-span-2 text-2xl font-bold mb-3">
            <i className={`fas ${state.icon} mr-3 text-${state.color}`}></i>
            {state.title}
          </div>
          <a
            onClick={handleClose}
            className="col-span-2 md:col-span-1 border-gray-500 hover:bg-gray-500 text-gray-500 font-bold hover:text-white border-2 rounded-full py-3 px-6 cursor-pointer">
            {tl("abort")}
          </a>
          <a
            onClick={handleConfirm}
            className={`col-span-2 md:col-span-1 bg-${state.color} hover:opacity-80 text-white font-bold border-white border-2 rounded-full py-3 px-6 cursor-pointer capitalize`}>
            {tl("confirm")}
          </a>
        </div>
      </div>
    </Dialog>
  );
};
