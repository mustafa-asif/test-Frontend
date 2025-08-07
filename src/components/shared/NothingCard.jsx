import { useTranslation } from "../../i18n/provider";

export const NothingCard = ({ children }) => {
  const tl = useTranslation();
  return (
    <div className="col-span-4 py-10">
      <div
        className="bg-white p-4 hover:shadow-xl transition duration-300 rounded-md z-10 flex flex-col gap-y-2 items-center justify-center"
        style={{ "boxShadow": "0px 0px 30px rgba(16, 185, 129, 0.1), inset 0 -10px 15px 0 rgba(16, 185, 129, 0.2)" }}
      >
        <h1 className="text-gray-400 uppercase">{tl("no_results")}</h1>
        {children}
      </div>
    </div>
  );
};
