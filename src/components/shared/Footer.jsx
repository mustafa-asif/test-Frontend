// import { LocaleContext } from "i18n/provider";
// // import { useContext } from "react";
import { title } from "../../tenant-config";
export const Footer = () => {
  //   const { changeLang, locale } = useContext(LocaleContext);
  //   const { value, label } = getLink(locale);
  return (
    <footer className="block">
      <div className="mx-auto px-4 py-3 border-t border-gray-200">
        <div className="flex flex-wrap items-center md:justify-between justify-center">
          <div className="w-full md:w-4/12 px-4">
            <div className="text-sm text-gray-500 font-semibold py-1 text-center md:text-left">
              Copyright © {new Date().getFullYear()} {title}
            </div>
          </div>
          <div className="w-full md:w-8/12 px-4">
            <ul className="flex flex-wrap list-none md:justify-end justify-center hidden">
              {/* <li>
                <a
                  onClick={() => {}}
                  className="text-gray-600 hover:text-gray-800 text-sm font-semibold block py-1 px-3 transition duration-300 cursor-pointer">
                  <i className="fas fa-globe"></i> {"EN"}
                </a>
              </li> */}
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-800 text-sm font-semibold block py-1 px-3 transition duration-300">
                  Legal
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-800 text-sm font-semibold block py-1 px-3 transition duration-300">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-800 text-sm font-semibold block py-1 px-3 transition duration-300">
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

function getLink(locale) {
  if (locale === "en") {
    return { value: "fr", label: "Français" };
  } else {
    return { value: "en", label: "English" };
  }
}
