import { createContext, useContext } from "react";
import strings from "./strings";

// default will be changed to french
const def = (() => {
  const saved = localStorage.getItem("$LANG");
  // check queryParam
  if (["fr", "en"].includes(saved)) return saved;
  else return "fr";
})();

export const LocaleContext = createContext(def);

export const LocaleProvider = ({ children }) => {
  const locale = def;

  function tl(label, values = {}) {
    let string = strings[locale][label];
    if (!string) return strings["fr"][label] || strings["en"][label] || label;
    for (const val in values) {
      const regex = new RegExp(`{${val}}`, "g");
      string = string.replace(regex, values[val]);
    }

    return string;
  }

  function changeLang(lang) {
    if (!["en", "fr", "ar"].includes(lang)) return;
    localStorage.setItem("$LANG", lang);
    window.location.reload(); // reload, live rerender not necessary;
  }

  return (
    <LocaleContext.Provider value={{ changeLang, locale, tl }}>{children}</LocaleContext.Provider>
  );
};

export const useTranslation = () => {
  return useContext(LocaleContext).tl;
};

export const useLang = () => {
  return useContext(LocaleContext).locale;
};
