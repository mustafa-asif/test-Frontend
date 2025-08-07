import { useTranslation } from "../../i18n/provider";
import { cl } from "../../utils/misc";
import { getColorConf, getIconConf } from "../../utils/styles";

export const ModelDisplay = ({ model, className }) => {
  const color = "green-500";
  const icon = getIconConf(model, "in progress");
  const tl = useTranslation();
  return (
    <div
      className={cl(
        "flex items-center justify-center border rounded-md  cursor-default w-max mx-auto px-[5px] ",
        `border-${color} text-${color}  `,
        className
      )}>
      <i className={cl("text-sm fas ", icon)}></i>
      <span className="text-sm ml-1">{tl(model)}</span>
    </div>
  );
};
