import { createRef, useEffect, useState } from "react";
import { useTranslation } from "../../i18n/provider";
import { Input } from "./Input";
import { cl } from "../../utils/misc";

export const FileInput = ({ file, setFile, disabled, readOnly, className = "", ...props }) => {
  const tl = useTranslation();
  const default_value = tl("no_file");
  const [uploaded, setUploaded] = useState(default_value);
  const inputRef = createRef();

  function handleUpload(e) {
    const uF = e.target.files[0];
    if (uF) {
      setFile(uF);
      setUploaded(uF.name || default_value);
    } else {
      setFile(null);
      setUploaded(default_value);
    }
  }

  function openFileSelect() {
    if (disabled || readOnly) return;
    inputRef.current?.click();
  }

  useEffect(() => {
    setUploaded(file?.name || file || default_value);
  }, [file]);

  return (
    <div className={cl("relative", className)}>
      <input type="file" className="hidden" onChange={handleUpload} ref={inputRef} {...props} />

      <Input
        value={uploaded.split("/").pop()}
        onChange={(e) => setUploaded(e.target.value)}
        onClick={openFileSelect}
        disabled={disabled}
        readOnly
      />
      <div
        className={`flex items-center flex-col justify-center px-4 border-l text-gray-500 absolute pointer-events-none right-0 bottom-0 top-0 mx-auto z-20 cursor-${
          disabled || readOnly ? "default" : "cursor"
        }`}>
        <i className="fas fa-upload"></i>
      </div>
    </div>
  );
};
