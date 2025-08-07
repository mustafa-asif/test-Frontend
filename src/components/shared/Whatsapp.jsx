import { useState } from "react";
import HiddenPhone from "./HiddenPhone";

export const Whatsapp = ({ number, label, hideNumber }) => {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="rounded-full h-8 flex items-center col-span-2 font-bold bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-green-500 shadow-sm hover:shadow-md justify-center transition duration-300 gap-2">
      {hideNumber ? (
        <HiddenPhone phone={number} className="line-clamp-2 leading-4 px-3" showIcon={false} onReveal={() => setRevealed(true)} metadata={{ action: "whatsapp" }} />
      ) : (
        <a href={`tel:0${+number}`}>
          <span className="line-clamp-2 leading-4 px-3">{label ?? number}</span>
        </a>
      )}
      {(!hideNumber || revealed) && (
        <a
          className="ml-auto mr-1"
          href={`https://wa.me/212${+number}`}
          target="_blank"
          rel="noreferrer">
          <i className="fab fa-whatsapp bg-green-500 text-white rounded-full p-1.5"></i>
        </a>
      )}
    </div>
  );
};
