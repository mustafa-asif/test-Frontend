import { getColorConf, getIconConf } from "../../utils/styles";

export const StatusView = ({ model, status }) => {
  return (
    <div
      className={`bg-gradient-to-r from-${getColorConf(model, status)} to-${getColorConf(
        model,
        status,
        "2"
      )} rounded-full h-10 text-lg text-white flex items-center shadow-sm hover:shadow-md justify-center transition duration-300`}>
      <i className={`fas ${getIconConf(model, status)}`}></i>
    </div>
  );
};
