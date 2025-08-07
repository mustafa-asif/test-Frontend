import { audioSrc } from "../../utils/constants";
import { cl } from "../../utils/misc";

export const Audio = ({ public_id, className = undefined, ...props }) => {
  const url = audioSrc(public_id);

  return (
    <>
      <audio className={cl("", className)} src={url} controls {...props} />
    </>
  );
};
