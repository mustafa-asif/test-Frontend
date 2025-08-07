import { useEffect, useState } from "react";
import { imgSrc } from "../../utils/constants";

export const ImagePreview = ({ image, className, style }) => {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    if (typeof image === "string" && image !== "") setSrc(imgSrc(image));
    else if (typeof image === "object") setSrc(URL.createObjectURL(image));
    else setSrc(null);
  }, [image]);

  if (!src) {
    return (
      <div
        style={style}
        className="bg-gray-100 flex items-center justify-center text-sm text-gray-400 px-2 overflow-hidden">
        empty
      </div>
    );
  }
  return (
    <a href={src} target="_blank">
      <img src={src} className={className} style={style} />
    </a>
  );
};
