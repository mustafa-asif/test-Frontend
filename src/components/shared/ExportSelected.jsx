import { useState } from "react";
import { API_URL, xFetch } from "../../utils/constants";
import { IconButton } from "./Button";

export const ExportSelected = ({ className, model = "", ids = [] }) => {

    const url = new URL([API_URL, model, "summary.html"].join("/"));

    if (ids.length > 0) {
        ids.forEach((id) => url.searchParams.append("ids", id));
    }


    return (
        <a
            
            href={url}
            target="_blank"
            download={`${model}-summary.html`}
            className={`bg-white px-4 hover:bg-gray-200 hover:text-gray-900 hover:shadow-xl transition duration-300 rounded-xl z-10 text-lg font-bold uppercase flex items-center justify-center h-12` }
            style={{
                height: 45,
                boxShadow:
                    "0px 0px 30px rgba(16, 185, 129, 0.2), inset 0 -10px 15px 0 rgba(16, 185, 129, 0.4)",
            }}>
            <i className="fas fa-print text-red-400 pr-2"></i>
            Imprimer
        </a>
    );

};
