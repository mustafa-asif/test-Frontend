import { cl } from "../../utils/misc";

export const CardSectionx = ({
  children,
  className = "",
  colSpan = 4,
  label = "",
  unStyled = false,
  isFlat = false,
  hideLabel = false,
}) => {
  return (
    <div
      className={cl(
        "flex gap-[2px]",
        { "flex-col": !isFlat },
        { "gap-x-[10px]": isFlat },
        className,
        { "p-2 bg-black/5 border-black/10 border": !unStyled },
        { "col-span-6": colSpan === 6 },
        { "col-span-4": colSpan === 4 },
        { "col-span-3": colSpan === 3 },
        { "col-span-2": colSpan === 2 },
        { "col-span-1": colSpan === 1 }
      )}>
      <p className={cl("uppercase text-gray-500 text-sm font-semibold", { hidden: hideLabel })}>
        {label}
      </p>
      <div className="grid grid-cols-4 gap-2">{children}</div>
    </div>
  );
};

export const CardSection = ({ children, className = "", colSpan = 4, label = "" }) => {
  return children;
};
