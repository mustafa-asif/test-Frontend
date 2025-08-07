
import { Dialog } from '@mui/material';
import { useTranslation } from '../../i18n/provider';

export default function PostponedSelectorDialog({ openDialog = false, onClose, onSelectPostponedBy }) {
    const tl = useTranslation();
    return (
        <>
            <Dialog onClose={onClose} open={openDialog}>
                <div className="flex flex-col overflow-y-scroll rounded-md bg-white text-xl p-6" id="red">
                    <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="col-span-2 text-2xl font-bold mb-3">
                            {tl("Who postponed?")}
                        </div>
                        <a
                            onClick={() => onSelectPostponedBy('client')}
                            className="col-span-2 md:col-span-1 border-gray-500 hover:bg-gray-500 text-gray-500 font-bold hover:text-white border-2 rounded-full py-3 px-6 cursor-pointer">
                            {tl("Reported by customer")}👨🏻‍💼
                        </a>
                        <a
                            onClick={() => onSelectPostponedBy('livreur')}
                            className="col-span-2 md:col-span-1 border-gray-500 hover:bg-gray-500 text-gray-500 font-bold hover:text-white border-2 rounded-full py-3 px-6 cursor-pointer">
                            {tl("Reported by deliverer")}🛵
                        </a>
                    </div>
                </div>
            </Dialog>
        </>
    );
}