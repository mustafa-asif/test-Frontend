import { useEffect, useRef, useState } from "react";
import { AutocompleteInput } from "./Input";
import { xFetch } from "../../utils/constants";
import { globalFilterToQuery } from "../../utils/misc";
import { Dots } from "./Dots";




export const SupportCategoryFilter = ({ model, value, supportCategory, filter, icon, onValueChange }) => {
    const [isLoading, setLoading] = useState(false);
    const [counts, setCounts] = useState(null);
    const isOpenRef = useRef(false);
    const [supportCategories, setSupportCategories] = useState([]);

    useEffect(() => {
        fetchPageSupportCategories();
    }, [supportCategory]);

    async function fetchPageSupportCategories() {
        const { data, error } = await xFetch(`/supportCategories/matching`, undefined, undefined, undefined, [
            `page_path=/${model}`,
        ]);
        setLoading(false);
        if (error) console.log(error, "failed to get support categories");
        else {
            let formattedSupportCategories = {};
            data.forEach(item =>
                formattedSupportCategories[item.category] = item.sub_categories
            );
            if (supportCategory) {
                setSupportCategories(formattedSupportCategories[supportCategory]);
            } else {
                setSupportCategories(Object.keys(formattedSupportCategories));
            }
        }
    }

    const handleOpen = async () => {
        isOpenRef.current = true;
        if (counts) return;
        setLoading(true);
        const query = globalFilterToQuery({ ...filter, ['supportCategory']: supportCategory || "all" });
        const { data, error } = await xFetch(
            `/meta/${model}/support-categories`,
            undefined,
            undefined,
            undefined,
            query
        );
        setLoading(false);
        if (!isOpenRef.current) return;
        if (error) {
            console.log(error);
            return;
        }
        // setSupportCategories(Object.keys(data));
        setCounts(data);
    };

    const resetCounts = () => {
        setLoading(true);
        setCounts(null);
    };

    const handleClose = () => {
        isOpenRef.current = false;
        resetCounts();
    };

    return (
        <>
            {supportCategories.length ? (
                <AutocompleteInput
                    icon={icon}
                    value={value}
                    blurOnSelect
                    onValueChange={onValueChange}
                    onOpen={handleOpen}
                    onClose={handleClose}
                    options={["all", ...supportCategories]}
                    className="cursor-pointer select-none flex-1"
                    inputProps={{
                        className: "flex-1 uppercase border-none select-none font-bold",
                        readOnly: true,
                    }}
                    renderOption={(li, option) => {
                        let count = 0;
                        if (counts) {
                            if (option === "all") {
                                count = Object.values(counts).reduce((sum, number) => sum + number, 0);
                            } else {
                                count = counts?.[option] ?? 0;
                            }
                        }
                        return (
                            <li {...li}>
                                {/* {option === "all" ? <span className={`mr-2 w-6 text-center`}></span> : <span className={`mr-2 w-6 text-center`}>{icon}</span>} */}
                                {option?.toUpperCase()}
                                {(counts || isLoading) && (
                                    <span className={`text-gray-400 ml-2`}>
                                        ({isLoading ? <Dots isAnimating speed={350} /> : count})
                                    </span>
                                )}
                            </li>
                        );
                    }}
                />): ""}
        </>
    );
};
