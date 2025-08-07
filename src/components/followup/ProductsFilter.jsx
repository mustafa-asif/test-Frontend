import { useState } from "react";
import { AutocompleteInput } from "../shared/Input";


let options = [
    { "label": "all", "id": "all" },
    { "label": "with deliverer", "id": "with-deliverer" },
    { "label": "with deliverer > 5 days", "id": "with-deliverer-5-days" },
    { "label": "undergoing transfer", "id": "undergoing-transfer" },
    { "label": "undergoing transfer > 10 days", "id": "undergoing-transfer-10-days" },
    { "label": "lost", "id": "lost" },
    { "label": "in warehouse", "id": "in-warehouse" },
    { "label": "locked items client", "id": "locked-items-client" },
    { "label": "stock client", "id": "stock-client" },
    { "label": "express client", "id": "express-client" },
    { "label": "inactive in warehouse between 1 -2 month", "id": "inactive-in-warehouse-between-1-2-month" },
    { "label": "inactive in warehouse between 2-3 month", "id": "inactive-in-warehouse-between-2-3-month" },
    { "label": "inactive in warehouse between 3-10 month", "id": "inactive-in-warehouse-between-3-10-month" },
    { "label": "need to return", "id": "need-to-return" }
];


export const ProductsFilter = ({ model, type, value, filter, icon, onValueChange }) => {

    const [displayValue, setDisplayValue] = useState(value);

    return (
        <AutocompleteInput
            icon={icon}
            value={displayValue}
            blurOnSelect
            onValueChange={(selectedOption) => { onValueChange(selectedOption.id); setDisplayValue(selectedOption.label); }}
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
