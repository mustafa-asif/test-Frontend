export const LoadingView = ({ label = "loading" }) => {
  // const tl = useTranslation();
  return (
    <div className="flex items-center justify-center p-2">
      <div
        style={{ borderTopColor: "#FBBF24" }}
        className="rounded-full border-8 border-t-8 border-white h-12 w-12 animate-spin m-auto"></div>
    </div>
  );
};
