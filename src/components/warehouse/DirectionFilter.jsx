import { useMemo, useRef, useState } from "react";
import { useTranslation } from "../../i18n/provider";
import { getColorConf, getIconConf } from "../../utils/styles";
import { AutocompleteInput } from "../shared/Input";

export const DirectionFilter = ({ value, onValueChange }) => {
  const tl = useTranslation();
  return (
    //
    <AutocompleteInput
      icon={getIconConf("direction", value)}
      iconColor={getColorConf("direction", value)}
      options={["all", "outgoing", "incoming"]}
      value={value}
      onValueChange={onValueChange}
      className="cursor-pointer select-none flex-1"
      inputProps={{
        className: " flex-1 uppercase border-none select-none font-bold ",
        readOnly: true,
      }}
      renderOption={(li, option) => {
        const color = getColorConf("direction", option);
        const icon = getIconConf("direction", option);
        return (
          <li {...li}>
            <i className={`fas mr-2 ${icon} text-${color} w-6 text-center`}></i>
            {tl(option)?.toUpperCase()}
          </li>
        );
      }}
    />
    //
  );
};
