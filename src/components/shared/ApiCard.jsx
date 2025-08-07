import { useEffect, useState } from "react";
import { xFetch } from "../../utils/constants";
import { IconButton } from "../shared/Button";
import { Input } from "../shared/Input";
import { Copyable } from "../shared/Copyable";
import { useTranslation } from "../../i18n/provider";
import { HumanDate } from "./HumanDate";

export const ApiCard = () => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputVal, setInputVal] = useState(""); // Only set after generation
  const [hasKey, setHasKey] = useState(false); // True if a key exists (from fetch)
  const [showKeyOnce, setShowKeyOnce] = useState(false); // True only after generation
  const [keyLabel, setKeyLabel] = useState("");
  const [keyDate, setKeyDate] = useState("");
  const t = useTranslation();

  async function fetchKey() {
    if (isLoading) return;
    setLoading(true);
    const { data, error } = await xFetch("/auth/keys");
    setLoading(false);
    if (error) return setError(error);
    if (data && data[0] && data[0].key) {
      setHasKey(true);
      setKeyLabel(data[0].label || "");
      setKeyDate(data[0].date_created || "");
    } else {
      setHasKey(false);
      setKeyLabel("");
      setKeyDate("");
    }
    setInputVal(""); // Never show the key after fetch
    setShowKeyOnce(false);
  }

  async function generateKey() {
    if (isLoading) return;
    setLoading(true);
    const { data, error } = await xFetch("/auth/keys", { method: "POST" });
    setLoading(false);
    if (error) return setError(error);
    if (data && data.key) {
      setInputVal(data.key);
      setHasKey(true);
      setShowKeyOnce(true);
      setKeyLabel(data.label || "");
      setKeyDate(data.date_created || "");
    }
  }

  useEffect(() => {
    fetchKey();
  }, []);

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 p-4 shadow-md rounded-xl">
      {showKeyOnce && inputVal ? (
        <div className="flex flex-col items-center w-full">
          <div className="flex flex-row items-center w-full mb-4">
            <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 shadow mr-6">
              <svg className="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 20 20"><path d="M18 8a6 6 0 1 0-11.472 2.472l-4.257 4.257a2 2 0 1 0 2.828 2.828l4.257-4.257A6 6 0 0 0 18 8Zm-6 4a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" /></svg>
            </div>
            <div className="flex-1">
              <Copyable
                text={<Input value={inputVal} readOnly />}
                copyText={inputVal}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex flex-row items-center bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mb-4 w-full max-w-xl">
            <svg className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" /></svg>
            <span className="text-sm text-yellow-700">{t("api_key_generated") + ". " + t("api_key") + ": " + t("key_viewable_once")}</span>
          </div>
        </div>
      ) : hasKey ? (
        <div className="flex flex-col items-center w-full">
          <div className="flex flex-row items-center w-full mb-4">
            <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 shadow mr-6">
              <svg className="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 20 20"><path d="M18 8a6 6 0 1 0-11.472 2.472l-4.257 4.257a2 2 0 1 0 2.828 2.828l4.257-4.257A6 6 0 0 0 18 8Zm-6 4a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" /></svg>
            </div>
            <div className="flex flex-col items-start flex-1">
              {keyLabel && <span className="text-lg font-medium text-gray-700 mb-1">{keyLabel}</span>}
              {keyDate && <span className="text-xs text-gray-500"><HumanDate date={new Date(keyDate)} /></span>}
            </div>
          </div>
          <div className="flex flex-row items-center bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mb-4 w-full max-w-xl">
            <svg className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" /></svg>
            <span className="text-sm text-yellow-700">{t("regenerate_key_info")}</span>
          </div>
          <button
            className="bg-black text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-gray-900 transition"
            onClick={generateKey}
            disabled={isLoading}
          >
            {isLoading ? t("loading") : t("new_key")}
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full">
          <IconButton
            icon="key"
            iconColor="black"
            className="mb-2"
            onClick={generateKey}
            isLoading={isLoading}
          />
          <span className="text-center text-sm text-gray-500 mt-2">{t("new_key")}</span>
        </div>
      )}
      {error && <span className="text-center text-sm text-red-400 mt-2">{"Failed to fetch token"}</span>}
    </div>
  );
};
