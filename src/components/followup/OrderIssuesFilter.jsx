import { AutocompleteInput } from "../shared/Input";

const allIssues = [
    { "label": "all", "id": "all" },
    { "label": "awaiting pickup order", "id": "awaiting-pickup-order" },
    { "label": "transfer order", "id": "transfer-order" },
    { "label": "draft order", "id": "draft-order" }
];

export const OrderIssuesFilter = ({  value, onValueChange }) => {

    return (
        <AutocompleteInput
            icon={"fa-exclamation-circle"}
            value={value}
            blurOnSelect
            onValueChange={(selectedOption) => { onValueChange(selectedOption.id); setDisplayValue(selectedOption.label); }}
            options={allIssues}
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
