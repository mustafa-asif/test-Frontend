import { Checkbox } from "@mui/material";

export const PrintButton = ({ handleSelect, is_printed, selected_purges,client }) => {

    const isDisabled = selected_purges.some((purge) => purge.client._id !== client._id);
    
    return (
        <div
            className={`relative rounded-full h-10 flex items-center justify-center px-2 shadow-sm ${is_printed ? 'bg-green-100 text-green-500' : 'bg-gray-100 text-gray-500'}`}>
            <i className="fas fa-print px-1"></i>
            <Checkbox title="Selected" size="small" disabled={isDisabled} onChange={handleSelect} />
        </div>
    );
};

