import { Autocomplete } from "@mui/material";
import { useEffect, useState } from "react";
import { useDelivererOptions } from "./DelivererOptions";

// const CACHE_KEY = "__del_cache";

export const DelivererInput = ({ className = undefined, inputProps: inProps, ...props }) => {
  const { options, deliverer, setDeliverer } = useDelivererOptions();

  function handleChange(e, value) {
    setDeliverer?.(value);
  }
  const defaultClass =
    "border border-gray-400 bg-green-100 focus:border-green-500 transition-colors duration-200 px-3 text-gray-700 font-bold cursor-default outline-none focus:outline-none focus:shadow-md hover:bg-gray-50 focus:bg-gray-50";
  const defaultStyles = { height: 40, paddingLeft: 40 };

  return (
    <div className="flex relative items-center flex-1">
      <button
        className={"absolute left-1 bg-green-500 flex items-center justify-center"}
        style={{ height: 30, width: 30, borderRadius: "9999px" }}>
        <i className={"fas fa-motorcycle text-gray-100 text-base"}></i>
      </button>
      <Autocomplete
        autoHighlight
        clearOnBlur
        selectOnFocus={false}
        onChange={handleChange}
        options={options}
        value={deliverer}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => {
          const { className: muClass = "", ...inputProps } = params.inputProps;
          const { className: inputClass, ...ipProps } = inProps || {};
          return (
            <div ref={params.InputProps.ref} className="w-full">
              <input
                role="presentation"
                autoComplete="off"
                className={`${defaultClass} ${className} ${inputClass}`.trim()}
                style={{ ...defaultStyles }}
                {...inputProps}
                {...ipProps}
                required={props.required}
                onKeyDown={(e) => e.stopPropagation()}
              />
              {!!deliverer && (
                <div
                  className="absolute right-2 top-0 bottom-0 m-auto rounded-full bg-white hover:bg-gray-500 hover:text-white cursor-pointer w-5 h-5 flex items-center justify-center"
                  onClick={() => setDeliverer?.(null)}>
                  <span className="pointer-events-none">&times;</span>
                </div>
              )}
            </div>
          );
        }}
        {...props}
      />
    </div>
  );
};

// function getCachedOption() {
//   let cached_option = localStorage.getItem(CACHE_KEY);
//   if (!cached_option) return [];
//   try {
//     cached_option = JSON.parse(cached_option);
//     if (Array.isArray(cached_option)) return [cached_option];
//     else return [];
//   } catch {}
//   return [];
// }
