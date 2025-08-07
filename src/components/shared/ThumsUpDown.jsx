import { useState } from "react";
import { useToast } from "../../hooks/useToast";
import { useTranslation } from "../../i18n/provider";
import { xFetch } from "../../utils/constants";
const UP = "up";
const DOWN = "down";

export const ThumbsUpDown = ({ model, authRole, document_id, messageId, existingThumbsSelection }) => {
    const [thumbsSelection, setThumbsSelection] = useState(existingThumbsSelection || null);
    const showToast = useToast();
    const tl = useTranslation();

    async function handleThumbs(selectedThumbs) {
        if (selectedThumbs === thumbsSelection) return;
        const { error } = await xFetch(`/${model}/${document_id}/messages/thumbs/${messageId}`, {
            method: "PATCH",
            body: { selectedThumbs },
        });
        if (error) {
            return showToast(error, "error");
        }
        showToast(tl("Thanks for the review"), "success");
        console.log(selectedThumbs);
        setThumbsSelection(selectedThumbs);
    }

    return (
        // {`col-span-2 ${fields.to_account !== "warehouse" ? "hidden" : ""}`}
        <div className="flex inline ml-1">
            {
                authRole === "client" && (
                    <>
                        <div className="ml-1 bg-gradient-to-r from-gray-50 to-gray-300 hover:from-gray-200 hover:to-green-300 rounded-full h-8 w-8 text-xs  flex items-center shadow-sm justify-center transition duration-300 hover:shadow-md cursor-pointer">
                            <i className={`fa${thumbsSelection === UP ? "s" : "r"} fa-thumbs-up cursor-pointer`} onClick={() => handleThumbs(UP)} style={{ color: 'green', fontSize: '20px' }}></i>
                        </div>
                        <div className="ml-1 bg-gradient-to-r from-gray-50 to-gray-300 hover:from-gray-200 hover:to-red-300 rounded-full h-8 w-8 text-xs  flex items-center shadow-sm justify-center transition duration-300 hover:shadow-md cursor-pointer">
                            <i className={`fa${thumbsSelection === DOWN ? "s" : "r"} fa-thumbs-down ml-1 cursor-pointer`} onClick={() => handleThumbs(DOWN)} style={{ color: 'red', fontSize: '20px' }}></i >
                        </div>
                    </>)
            }

            {
                (authRole === "followup" || authRole === "warehouse") && (
                    <>
                        {thumbsSelection === UP && <div className="ml-1 bg-gradient-to-r from-gray-50 to-gray-300  rounded-full h-8 w-8 text-xs  flex items-center shadow-sm justify-center">
                            <i className={`fas fa-thumbs-up`} style={{ color: 'green', fontSize: '20px' }}></i>
                        </div>}
                        {thumbsSelection === DOWN && <div className="ml-1 bg-gradient-to-r from-gray-50 to-gray-300  rounded-full h-8 w-8 text-xs  flex items-center shadow-sm justify-center">
                            <i className={`fas fa-thumbs-down ml-1`} style={{ color: 'red', fontSize: '20px' }}></i >
                        </div>}
                    </>)
            }
        </div >
    );
};

