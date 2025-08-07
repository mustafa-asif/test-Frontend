import { AutocompleteInput } from "../shared/Input";

const options = [
    { "label": "all", "id": "all" },
    { "label": "need to return", "id": "need-to-return" }

];

export const NeedToReturnFilter = ({  value, onValueChange }) => {

    return (
        <AutocompleteInput
            icon={"fa-undo"}
            value={value}
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
