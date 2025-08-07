import { useTranslation } from "../../i18n/provider";
import { AutocompleteInput } from "../shared/Input";

const options = [
    { "label": "Updated Date", "id": "updated" },
    { "label": "Created Date", "id": "created" }
];

export const DateTypeFilter = ({  value, onValueChange, user = {} }) => {
    const tl = useTranslation();

    return (
        <AutocompleteInput
            icon={"fa-calendar"}
            value={user?.role === "client" ? tl(value) : value}
            blurOnSelect
            onValueChange={(selectedOption) => { onValueChange(selectedOption.id); setDisplayValue(selectedOption.label); }}
            options={options.map(option => ({
                ...option,
                label: user?.role === "client" ? tl(option.label) : option.label,
            }))}
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
