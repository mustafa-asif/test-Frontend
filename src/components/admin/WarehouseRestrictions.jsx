import { useState } from "react";
import { WarehouseMultiselect } from "../shared/WarehousesMultiselect";
import { useTranslation } from "../../i18n/provider";

export const WarehouseRestrictions = ({ warehouses, setWarehouses }) => {

    const _handleValueChange = (value) => {
        setWarehouses(value);
    }

    const tl = useTranslation();

    return (
        <div>
            <label className="block mb-2 text-md font-medium text-gray-700 font-sans">{tl("Warehouses")}</label>
            <WarehouseMultiselect value={warehouses} onValueChange={_handleValueChange} />
        </div>
    )
}