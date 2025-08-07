import { useTranslation } from "../../i18n/provider";
import { cl, translateStatus } from "../../utils/misc";
import { getColorConf, getIconConf } from "../../utils/styles";

export const StatusDisplay = ({ model, status, className, date }) => {
  const color = getColorConf(model, status);
  const icon = getIconConf(model, status);
  const tl = useTranslation();
  return (
    <div
      className={cl(
        "flex items-center justify-center border rounded-md cursor-default w-max px-[5px] ",
        `border-${color} text-${color}  `,
        className
      )}>
      <i className={cl("text-sm fas ", icon)}></i>
      <span className="text-sm ml-1">{translateStatus(model, status)}</span>
      {date && <span className="text-xs ml-1 opacity-80">{date}</span>}
    </div>
  );
};
