import { Autocomplete } from "@mui/material";
import { useEffect, useState } from "react";
import { xFetch } from "../../utils/constants";
import { cl } from "../../utils/misc";

export const Input = ({
  className = "",
  onValueChange = undefined,
  onChange = undefined,
  style = undefined,
  ...props
}) => {
  const defaultClass = cl(
    "transition-colors duration-200 px-3 text-gray-700 cursor-default w-full bg-white border rounded-full outline-none border-gray-400 focus:outline-none focus:border-green-500 focus:shadow-sm hover:bg-gray-50 focus:bg-gray-50",
    { "!bg-gray-100 pointer-events-none": props.disabled }
  );

  const defaultStyles = { height: 46, minWidth: 75 };

  function handleChange(e) {
    onChange?.(e);
    onValueChange?.(e.target.value);
  }
  return (
    <input
      role="presentation"
      autoComplete="off"
      className={`${defaultClass} ${className}`.trim()}
      onChange={handleChange}
      style={{ ...defaultStyles, ...style }}
      {...props}
    />
  );
};

export const AutocompleteInput = ({
  onValueChange = undefined,
  onChange = undefined,
  displayArrows = false,
  fullWidth = true,
  className = undefined,
  icon = undefined,
  iconColor = "gray-500",
  size = 46,
  inputProps: inProps = undefined,
  ...props
}) => {
  function handleChange(e, value) {
    onValueChange?.(value);
    onChange?.(e);
  }

  const defaultClass = cl(
    "border border-gray-400 focus:border-green-500 transition-colors duration-200 px-3 text-gray-700 cursor-default bg-white rounded-full outline-none focus:outline-none focus:shadow-sm hover:bg-gray-50 focus:bg-gray-50 ",
    { "!bg-gray-100 pointer-events-none": props.disabled },
    { "w-full": fullWidth }
  );

  const defaultStyles = { height: size, minWidth: 75 };
  if (icon) defaultStyles.paddingLeft = 50;

  return (
    <div className="flex relative items-center">
      {props.displayRedEyeCatcher && (
        <>
          <i
            className={"fas fa-circle fa-lg  absolute right-0 top-0 animate-ping text-red-500"}></i>
          <i className={"fas fa-circle fa-lg  absolute right-0 top-0 text-red-500"}></i>
        </>
      )}
      {icon && (
        <button
          className={`absolute left-1 bg-${iconColor} flex items-center justify-center`}
          style={{ height: 38, width: 38, borderRadius: 19 }}>
          <i className={`fas ${icon} text-gray-100 text-xl`}></i>
        </button>
      )}
      <Autocomplete
        className={"w-full"}
        autoHighlight
        selectOnFocus={false}
        onChange={handleChange}
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
              />
            </div>
          );
        }}
        {...props}
      />
      {displayArrows && (
        <div className="flex items-center flex-col justify-center px-4 border-l text-gray-500 absolute right-0 bottom-0 top-0 mx-auto z-20 pointer-events-none">
          <i className="fas fa-chevron-up"></i>
          <i className="fas fa-chevron-down"></i>
        </div>
      )}
    </div>
  );
};

export const IconInput = ({ icon = "", children, ...props }) => {
  return (
    <div className="relative flex items-center flex-1">
      <Input style={{ paddingLeft: 50, border: `none` }} {...props} />
      <div
        className="absolute left-1 bg-gray-500 flex items-center justify-center"
        style={{ height: 38, width: 38, borderRadius: 19 }}>
        <i className={`fas fa-${icon} text-gray-100 text-xl`}></i>
      </div>
      {children}
    </div>
  );
};

export const Checkbox = ({ className = "", value, onValueChange, ...props }) => {
  return (
    <input
      role="presentation"
      autoComplete="off"
      type="checkbox"
      checked={!!value}
      onChange={(e) => {
        props.onChange?.(e);
        onValueChange?.(e.target.checked);
      }}
      className={`h-6 w-6 ${className}`}
      {...props}
    />
  );
};

export const NumberInput = ({ onValueChange, ...props }) => {
  return (
    <Input
      type="tel"
      pattern="[0-9]*"
      onChange={(e) => {
        // if (e.target.value.length > 10) return; props.maxLength
        if (!e.target.validity.valid && !!e.target.value) return;
        onValueChange(e.target.value);
      }}
      {...props}
    />
  );
};

export const AsyncAutocompleteInput = ({
  onValueChange = undefined,
  onChange = undefined,
  displayArrows = false,
  fullWidth = true,
  className = undefined,
  icon = undefined,
  iconColor = "gray-500",
  size = 46,
  source_url,
  inputProps: inProps,
  prefetch = false,
  ...props
}) => {
  const [options, setOptions] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (prefetch) fetchOptions();
  }, []);

  async function fetchOptions() {
    if (isLoading) return;
    setLoading(true);
    const { data, error } = await xFetch(source_url);
    setLoading(false);
    if (error) {
      console.error(error);
      setOptions(["error"]);
    }
    setOptions(data);
  }

  function handleChange(e, value) {
    onValueChange?.(value);
    onChange?.(e);
  }

  function handleOpen(e) {
    if (prefetch) return;
    fetchOptions();
  }
  const defaultClass = `${
    fullWidth ? "w-full" : ""
  } border border-gray-400 focus:border-green-500 transition-colors duration-200 px-3 text-gray-700 cursor-default bg-white rounded-full outline-none focus:outline-none focus:shadow-md hover:bg-gray-50 focus:bg-gray-50 `;

  const defaultStyles = { height: size };
  if (icon) defaultStyles.paddingLeft = 50;

  return (
    <div className="flex relative items-center flex-1">
      {icon && (
        <button
          className={`absolute left-1 bg-${iconColor} flex items-center justify-center`}
          style={{ height: 38, width: 38, borderRadius: 19 }}>
          <i className={`fas ${icon} text-gray-100 text-xl`}></i>
        </button>
      )}
      <Autocomplete
        className={"w-full"}
        autoHighlight
        options={isLoading ? ["loading"] : options}
        selectOnFocus={false}
        onChange={handleChange}
        onOpen={handleOpen}
        renderOption={(renderProps, option) => {
          return (
            <li
              {...renderProps}
              className={cl(renderProps.className, {
                "pointer-events-none": ["error", "loading"].includes(option),
              })}>
              {option === "loading" ? (
                <div className="flex items-center gap-x-3">
                  <span
                    style={{ borderTopColor: "#FBBF24" }}
                    className="inline-block w-6 h-6 rounded-full border-4 border-t-4 border-gray animate-spin"></span>
                  <div className="animate-pulse">Loading...</div>
                </div>
              ) : option === "error" ? (
                <div className="flex items-center gap-x-3">
                  <i className="fas fa-times text-red-500"></i>
                  <div className="">Internal Error: Failed to fetch options. 🥴</div>
                </div>
              ) : (
                <span>{props.getOptionLabel?.(option) ?? option}</span>
              )}
            </li>
          );
        }}
        renderInput={(params) => {
          const { className: muClass = "", ...inputProps } = params.inputProps;
          const { className: inputClass, ...ipProps } = inProps || {};
          return (
            <div ref={params.InputProps.ref} className="w-full relative">
              <input
                role="presentation"
                autoComplete="off"
                type="text"
                name="pack"
                className={`${defaultClass} ${className} ${inputClass}`.trim()}
                style={{ ...defaultStyles }}
                {...inputProps}
                {...ipProps}
                required={props.required}
              />
            </div>
          );
        }}
        {...props}
      />
      {displayArrows && (
        <div className="flex items-center flex-col justify-center px-4 border-l text-gray-500 absolute right-0 bottom-0 top-0 mx-auto z-20 pointer-events-none">
          <i className="fas fa-chevron-up"></i>
          <i className="fas fa-chevron-down"></i>
        </div>
      )}
    </div>
  );
};
