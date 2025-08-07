import { Link } from "react-router-dom";
import { imgSrc } from "../../utils/constants";
import { cl } from "../../utils/misc";
import { isTenant, secondaryColor } from "../../tenant-config";
import { useState } from "react";

export const Button = ({
  className = "",
  btnColor = "primary",
  label = "",
  isLoading = false,
  disabled = false,
  icon = "",
  iconPosition = "",
  children = undefined,
  ...props
}) => {
  return (
    <button
      className={cl(
        "flex justify-center items-center relative w-full px-2 py-2 transition-shadows duration-300 rounded-full shadow-md  font-bold outline-none tracking-wide hover:shadow-lg active:shadow-sm focus:outline-none whitespace-nowrap overflow-hidden z-10",
        { "bg-primary text-primary-alt": btnColor === "primary" },
        { "bg-secondary text-secondary-alt": btnColor === "secondary" },
        { "bg-gray-700 text-white": btnColor === "gray" },
        {
          [`bg-${btnColor}-400 text-white`]:
            btnColor && !["primary", "secondary", "gray"].includes(btnColor),
        },
        className
      )}
      disabled={isLoading || disabled}
      {...props}>
      <div className="button-overlay"></div>
      {icon && !iconPosition && <i className={`fas fa-${icon} ${!!label ? "mr-2 -ml-2" : ""}`}></i>}
      {children ?? <span>{label}</span>}
      {icon && iconPosition && <i className={`fas fa-${icon} ${!!label ? "ml-2 -mr-2" : ""}`}></i>}
      {isLoading && (
        <span
          style={{ borderTopColor: !isTenant ? "#FBBF24" : secondaryColor }}
          className="inline-block w-6 h-6 absolute right-2 rounded-full border-4 border-t-4 border-white animate-spin"></span>
      )}
    </button>
  );
};

// export const IconButton = ({
//   icon,
//   size = "md",
//   className = "",
//   colorClass = "bg-gray-700 text-white",
//   positionClass = "relative",
//   image = undefined,
//   badge = undefined,
//   badgePing = false,
//   isLoading = false,
//   type = "button",
//   loadAimation = "",
//   ...props
// }) => {
//   // let defaultClass = `relative  ${
//   //   size === "md" ? "w-10 h-10 text-xl" : "w-12 h-12 text-2xl"
//   // } ${bgColor} text-${iconColor}-400 hover:text-${iconColor}-500 inline-flex items-center justify-center rounded-full shadow-lg hover:shadow-xl hover:bg-${iconColor}-100 transition duration-300`;
//   const extraProps = {};
//   if (image) {
//     extraProps.style = { backgroundImage: `url(${imgSrc(image)})`, backgroundSize: "100% 100%" };
//     // defaultClass = defaultClass.replaceAll(/^fa/g, "").replaceAll(/^bg/g, "");
//   }

//   // if (className.includes("absolute")) {
//   //   defaultClass = defaultClass.replace("relative", "");
//   // }

//   if (icon?.startsWith("fa-")) {
//     icon = icon.slice(3);
//   }

//   return (
//     <button
//       type={type}
//       className={cl(
//         "shrink-0 transition duration-300 inline-flex items-center justify-center rounded-full shadow-lg hover:shadow-xl opacity-90 hover:opacity-100",
//         { "w-10 h-10 text-xl": size === "md" },
//         { "w-12 h-12 text-2xl": size === "lg" },
//         positionClass,
//         colorClass,
//         className
//       )}
//       {...props}
//       {...extraProps}
//     >
//       <i className={`fas fa-${icon} ${isLoading ? loadAimation : ""} pointer-events-none`}></i>
//       {badge > 0 && (
//         <span className="absolute -top-1 right-0 pointer-events-none">
//           <div className="px-1.5 py-0.5 border-2 border-red-100 rounded-full text-xs font-semibold leading-4 bg-red-500 text-white">
//             {badge}
//           </div>
//           {badgePing && (
//             <span className="absolute top-0 right-0 -z-1 animate-ping h-full w-full rounded-full bg-red-500 opacity-75"></span>
//           )}
//         </span>
//       )}
//     </button>
//   );
// };

export const IconButton = ({
  icon,
  size = undefined,
  className = "",
  iconColor = "yellow",
  image = undefined,
  badge = undefined,
  badgePing = false,
  isLoading = false,
  type = "button",
  loadAimation = "",
  ...props
}) => {
  let defaultClass = `relative flex-shrink-0 ${
    size === "md" ? "w-10 h-10 text-xl" : "w-12 h-12 text-2xl"
  } bg-white text-${iconColor}-400 hover:text-${iconColor}-500 inline-flex items-center justify-center rounded-full shadow-lg hover:shadow-xl hover:bg-${iconColor}-100 opacity-90 hover:opacity-100 transition duration-300`;
  const extraProps = {};
  if (image) {
    extraProps.style = { backgroundImage: `url(${imgSrc(image)})`, backgroundSize: "100% 100%" };
    defaultClass = defaultClass.replaceAll(/^fa/g, "").replaceAll(/^bg/g, "");
  }

  if (className.includes("absolute")) {
    defaultClass = defaultClass.replace("relative", "");
  }

  if (icon?.startsWith("fa-")) {
    icon = icon.slice(3);
  }

  return (
    <button
      type={type}
      className={`${defaultClass} ${className}`.trim()}
      {...props}
      {...extraProps}>
      <i className={`fas fa-${icon} ${isLoading ? loadAimation : ""} pointer-events-none`}></i>
      {badge > 0 && (
        <span className="absolute -top-1 right-0 pointer-events-none">
          <div className="px-1.5 py-0.5 border-2 border-red-100 rounded-full text-xs font-semibold leading-4 bg-red-500 text-white">
            {badge}
          </div>
          {badgePing && (
            <span className="absolute top-0 right-0 -z-1 animate-ping h-full w-full rounded-full bg-red-500 opacity-75"></span>
          )}
        </span>
      )}
    </button>
  );
};

export const SButton = ({
  className = "",
  label = "",
  icon = "plus",
  iconColor = "green-500",
  disabled = false,
  href = "",
  style = undefined,
  badgePing = false,
  ...props
}) => {
  const defaultClass =
    "bg-white px-4 hover:bg-gray-200 hover:text-gray-900 hover:shadow-xl transition duration-300 rounded-xl z-10 text-lg font-bold uppercase flex items-center justify-center h-12 relative";
  const defaultStyles = {
    height: 45,
    boxShadow: "0px 0px 30px rgba(16, 185, 129, 0.2), inset 0 -10px 15px 0 rgba(16, 185, 129, 0.4)",
  };

  return (
    <Link
      to={href}
      className={`${defaultClass} ${className}`.trim()}
      disabled={disabled}
      style={{ ...defaultStyles, ...style }}
      {...props}>
      <i className={`fas fa-${icon} text-${iconColor} pr-2`}></i>
      {badgePing && (
        <span className="absolute -top-[5px] -right-[5px] pointer-events-none">
          <div className="px-1.5 py-0.5 border-2 border-red-100 rounded-full text-xs font-semibold leading-4 bg-red-500 text-white">
            !
          </div>
          {badgePing && (
            <span className="absolute top-0 right-0 -z-1 animate-ping h-full w-full rounded-full bg-red-500 opacity-75"></span>
          )}
        </span>
      )}
      {label}
    </Link>
  );
};

export const AltButton = ({ label = "", className = "", color = "blue", ...props }) => {
  const defaultClass = `px-4 py-1 bg-${color}-500 text-white text-sm shadow-sm hover:bg-${color}-600 hover:shadow-md active:bg-${color}-600 active:shadow-sm rounded-full transition-colors duration-300 ${
    props.disabled ? " opacity-70 pointer-events-none" : ""
  }`;
  return (
    <button className={[defaultClass, className].join(" ").trim()} {...props}>
      {label}
    </button>
  );
};
