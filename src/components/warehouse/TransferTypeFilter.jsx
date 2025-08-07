import { useState } from "react";
import { AutocompleteInput } from "../shared/Input";

const options = [
    { "label": "All", "id": "all" },
    { "label": "Lock", "id": "lock" },
    { "label": "Stock", "id": "stock" }
];

export const TransferTypeFilter = ({ value, onValueChange }) => {
    const [displayValue, setDisplayValue] = useState(value);

    return (
        <AutocompleteInput
            icon="fa-exchange-alt"
            value={displayValue}
            blurOnSelect
            onValueChange={(selectedOption) => { 
                onValueChange(selectedOption.id); 
                setDisplayValue(selectedOption.label); 
            }}
            options={options}
            className="cursor-pointer select-none flex-1"
            inputProps={{
                className: "flex-1 uppercase border-none select-none font-bold",
                readOnly: true,
            }}
            renderOption={(li, option) => {
                return (
                    <li {...li}>
                        {option?.label.toUpperCase()}
                    </li>
                );
            }}
        />
    );
}; 