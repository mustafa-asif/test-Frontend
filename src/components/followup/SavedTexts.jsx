import { Dialog } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { cl } from "../../utils/misc";
import { Button } from "../shared/Button";
import { Input } from "../shared/Input";

export const SavedTexts = ({ onSelect, disabled }) => {
  const [expanded, setExpanded] = useState(false);
  const [managerOpen, setManagerOpen] = useState(false);
  const [texts, setTexts] = useState(getSavedText());

  const height = 25;

  function onTextsChange(value) {
    setTexts(value);
    setSavedText(value);
  }
  return (
    <Fragment>
      <div className="px-2 py-2 w-full">
        <div
          className={cl("flex gap-y-2 gap-x-1 flex-wrap")}
          style={{ height: expanded ? undefined : height + 0 }}>
          <div
            className={cl(
              "text-sm bg-yellow-100 px-2 flex items-center justify-center text-black font-bold rounded-lg cursor-pointer ",
              { "shadow-md hover:shadow-xl": !managerOpen },
              { "border-2 border-solid border-yellow-500": managerOpen }
            )}
            style={{ height }}
            onClick={() => setManagerOpen(true)}>
            <i className="fas fa-pen"></i>
          </div>
          <div
            className={cl(
              "text-sm bg-yellow-100 px-2 flex items-center justify-center text-black font-bold rounded-lg cursor-pointer",
              { "shadow-md hover:shadow-xl": !expanded },
              { "border-2 border-solid border-yellow-500": expanded }
            )}
            style={{ height }}
            onClick={() => setExpanded((expanded) => !expanded)}>
            <i
              className={cl(
                "fas",
                { "fa-chevron-down": !expanded },
                { "fa-chevron-up": expanded }
              )}></i>
          </div>
          {texts.map((text) => (
            <span
              key={text.title}
              className={cl(
                "text-sm bg-yellow-50 px-2 flex items-center text-black rounded-lg shadow-md active:shadow-sm active:bg-yellow-100 whitespace-nowrap",
                { "cursor-pointer hover:shadow-xl": !disabled },
                { "pointer-events-none": disabled }
              )}
              style={{ height }}
              onClick={() => {
                onSelect(text.text);
              }}>
              {text.title}
            </span>
          ))}
        </div>
      </div>
      <SavedTextsManager
        onTextsChange={onTextsChange}
        onClose={() => setManagerOpen(false)}
        open={managerOpen}
        texts={texts}
      />
    </Fragment>
  );
};

function SavedTextsManager({ open, onClose, texts, onTextsChange }) {
  const [fields, setFields] = useState({ text: "", title: "" });
  const showToast = useToast();

  function handleSubmit(e) {
    e.preventDefault();
    const duplicate = texts.find((text) => text.title === fields.title);
    if (duplicate) {
      showToast(`title '${fields.title}' used`, "error");
      return;
    }
    onTextsChange([...texts, fields]);
    setFields({ text: "", title: "" });
  }

  function handleDelete(title) {
    onTextsChange(texts.filter((text) => text.title !== title));
  }
  return (
    <Dialog onClose={onClose} open={open}>
      <div className="p-3 flex flex-col gap-y-3">
        <p className="uppercase text-gray-500 text-sm font-semibold">Edit Saved Texts</p>
        {/*  */}
        <div className="bg-gray-100 p-3">
          <form className="flex flex-col gap-y-2" onSubmit={handleSubmit}>
            <div>
              <label className="text- text-gray-500">Label</label>
              <Input
                value={fields.title}
                onValueChange={(title) => setFields({ ...fields, title })}
                placeholder="short label"
                style={{ height: 38 }}
                maxLength={20}
              />
            </div>
            <div>
              <label className="text-gray-500">Text</label>
              <Input
                value={fields.text}
                onValueChange={(text) => setFields({ ...fields, text })}
                placeholder="message content"
                style={{ height: 38 }}
                maxLength={200}
                required
              />
            </div>
            <Button className="mt-2" style={{ height: 35 }} type="submit">
              Add
            </Button>
          </form>
        </div>
        <div
          className="bg-gray-50 p-3 flex flex-col gap-y-2 overflow-auto"
          style={{ maxHeight: 250, maxWidth: 400 }}>
          {texts.map((text) => (
            <div className="bg-yellow-200 flex gap-y-2 flex-col p-2 rounded-md" key={text.title}>
              <div className="flex justify-between">
                <div className="text-gray-600">{text.title}</div>
                <div
                  className="flex items-center justify-center bg-white text-red-500 text-xs  w-5 h-5 rounded-full shadow-md cursor-pointer hover:shadow-lg"
                  onClick={() => handleDelete(text.title)}>
                  <i className="fas fa-times"></i>
                </div>
              </div>

              <div className="bg-yellow-50 text-sm py-1 px-2 rounded-md">{text.text}</div>
            </div>
          ))}
        </div>
        {/*  */}
      </div>
      <p className="text-sm text-gray-500 text-center py-1">via localStorage</p>
    </Dialog>
  );
}

const key = "__QUICK_TEXT";

function getSavedText() {
  try {
    const saved = localStorage.getItem(key);
    const arr = JSON.parse(saved);

    if (!Array.isArray(arr)) return [];

    for (const val of arr) {
      if (typeof val.text === "string" && typeof val.title === "string") continue;

      // array contains invalid value
      return [];
    }

    return arr;
  } catch (err) {
    console.log(err, "error getting saved texts");
    return [];
  }
}

function setSavedText(newVal) {
  try {
    if (!Array.isArray(newVal)) {
      console.log("not array ", newVal);
      return false;
    }
    for (const val of newVal) {
      if (typeof val.text === "string" && typeof val.title === "string") continue;

      // array contains invalid value
      return false;
    }

    localStorage.setItem(key, JSON.stringify(newVal));

    return true;
  } catch (err) {
    console.log(err, "error getting saved texts");
    return false;
  }
}
