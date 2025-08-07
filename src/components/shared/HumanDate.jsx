import { getHumanDate } from "../../utils/constants";
import { Copyable } from "../shared/Copyable";

export const HumanDate = ({ date, long = false, interval = 1 }) => {
  if (!date) return <span>-</span>;
  return <Copyable className="inline" text={<span title={date.toLocaleString("fr-FR")}>{getHumanDate(date, long)}</span>} copyText={date.toLocaleString("fr-FR")} />;
};
