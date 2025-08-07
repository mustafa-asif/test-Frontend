import { imgSrc } from "../../utils/constants";
import { cl } from "../../utils/misc";

export const Image = ({ public_id, preview_transformations, className = undefined, ...props }) => {
  const previewUrl = imgSrc(public_id, preview_transformations);
  const url = imgSrc(public_id);

  return (
    <a href={url} target="_blank" className={cl("relative", className)} {...props} rel="noreferrer">
      <div className="absolute w-full h-full bg-gray-900 flex items-center justify-center text-white opacity-0 hover:opacity-50 duration-200 transition-opacity">
        <i className="fas fa-external-link-alt text-2xl"></i>
      </div>
      <img src={previewUrl} />
    </a>
  );
};
