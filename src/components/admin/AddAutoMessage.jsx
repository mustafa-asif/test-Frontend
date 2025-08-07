import { useState, useEffect } from "react";
import { Drawer } from "@mui/material";
import { useToast } from "../../hooks/useToast";
import { useBackClose } from "../shared/LastLocation";
import { Label } from "../shared/Label";
import { Button, IconButton } from "../shared/Button";
import { AutocompleteInput, Checkbox, Input } from "../shared/Input";
import { MultipleCombobox } from "../shared/MultipleCombobox";
import { xFetch } from "../../utils/constants";
import { xUploadImage, xUploadAudio } from "../../utils/misc";
import common from "./common";
import { FileInput } from "../shared/FileInput";
import { AudioRecord } from "../shared/AudioRecord";

const blank_fields = {
  text: "",
  target: {
    pages: "",
    status: "",
    category: "",
    subcategories: [],
  },
  active: true,
};

export const AddAutoMessage = ({ ...props }) => {
  const [fields, setFields] = useState(blank_fields);
  const [isLoading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [contentType, setContentType] = useState("text");
  const [localImage, setLocalImage] = useState(null);
  const [localAudio, setLocalAudio] = useState(null);

  const showToast = useToast();
  const onClose = useBackClose("/auto-messages");

  useEffect(() => {
    async function fetchCategories() {
      if (!fields.target.pages) {
        setCategories([]);
        return;
      }

      const { data, error } = await xFetch(
        `/supportCategories/matching`,
        undefined,
        undefined,
        undefined,
        [`page_path=${fields.target.pages}`],
      );

      if (error) {
        console.log(error, "failed to get categories");
        return;
      }

      const uniqueCategories = [...new Set(data.map((item) => item.category))];
      setCategories(uniqueCategories);

      if (uniqueCategories.length > 0) {
        setFields((prev) => ({
          ...prev,
          target: {
            ...prev.target,
            category: "",
            subcategories: [],
            pages: prev.target.pages,
          },
        }));
      }
    }

    fetchCategories();
  }, [fields.target.pages]);

  useEffect(() => {
    if (!fields.target.pages || !fields.target.category) {
      setSubcategories([]);
      return;
    }

    async function fetchSubcategories() {
      const { data, error } = await xFetch(
        `/supportCategories/matching`,
        undefined,
        undefined,
        undefined,
        [`page_path=${fields.target.pages}`],
      );

      if (error) {
        console.log(error, "failed to get subcategories");
        return;
      }

      const categoryData = data.find((item) => item.category === fields.target.category);
      setSubcategories(categoryData?.sub_categories || []);
    }

    fetchSubcategories();
  }, [fields.target.category]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if (contentType === "text" && !fields.text) {
      setLoading(false);
      showToast("Message text is required", "error");
      return;
    }
    if (contentType === "image" && !localImage) {
      setLoading(false);
      showToast("Image is required", "error");
      return;
    }
    if (contentType === "audio" && !localAudio) {
      setLoading(false);
      showToast("Audio is required", "error");
      return;
    }

    let media = null;
    if (contentType === "image") {
      const { data, error } = await xUploadImage(localImage);
      if (error) {
        setLoading(false);
        return showToast(error, "error");
      }
      media = { kind: "image", link: data };
    }

    if (contentType === "audio") {
      const { data, error } = await xUploadAudio(localAudio);
      if (error) {
        setLoading(false);
        return showToast(error, "error");
      }
      media = { kind: "audio", link: data };
    }

    const submitData = {
      ...fields,
      target: {
        ...fields.target,
        pages: [fields.target.pages],
        ...(fields.target.pages === "/orders" ? { status: fields.target.status } : {}),
      },
      media,
    };

    if (submitData.target.pages[0] !== "/orders") {
      delete submitData.target.status;
    }

    const { error } = await xFetch("/autoMessages", {
      method: "POST",
      body: submitData,
    });

    setLoading(false);

    if (error) {
      showToast(error, "error");
      return;
    }

    setFields(blank_fields);
    setContentType("text");
    setLocalImage(null);
    setLocalAudio(null);
    showToast("Success", "success");
  }

  function BackToTextBtn() {
    function handleClick() {
      if (!localImage && !localAudio) return setContentType("text");
      setLocalImage(null);
      setLocalAudio(null);
      setContentType("text");
    }
    return (
      <div
        className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full text-green px-4 py-1 shrink-0 hover:shadow-md cursor-pointer"
        onClick={handleClick}
      >
        <i className="fas fa-comments text-xl"></i>
      </div>
    );
  }

  return (
    <Drawer anchor="right" onClose={onClose} {...props}>
      <div className="w-screen sm:w-screen/1.5 h-full p-5 sm:p-10">
        <div className="mb-6">
          <IconButton icon="arrow-left" className="mr-3" iconColor="gray" onClick={onClose} />
          <span className="text-gray-700 text-lg md:text-2xl uppercase font-semibold">
            {"Add Auto Message"}
          </span>
        </div>
        <div className="pb-10">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-x-3 gap-y-5">
              <div className="col-span-2">
                <Label text={"Target Page"} />
                <AutocompleteInput
                  value={fields.target.pages}
                  onValueChange={(pages) =>
                    setFields({ ...fields, target: { ...fields.target, pages } })
                  }
                  disabled={isLoading}
                  options={common.allowedPages}
                  required
                />
              </div>

              {fields.target.pages === "/orders" && (
                <div className="col-span-2">
                  <Label text={"Target order status"} />
                  <AutocompleteInput
                    value={fields.target.status}
                    onValueChange={(status) =>
                      setFields({ ...fields, target: { ...fields.target, status } })
                    }
                    disabled={isLoading}
                    options={common.orderStatuses}
                    required
                  />
                </div>
              )}

              {fields.target.pages && categories.length > 0 && (
                <div className="col-span-2">
                  <Label text={"Category"} />
                  <AutocompleteInput
                    options={categories}
                    value={fields.target.category}
                    onValueChange={(category) =>
                      setFields({ ...fields, target: { ...fields.target, category } })
                    }
                    disabled={isLoading}
                    placeholder="Select category"
                  />
                </div>
              )}

              {fields.target.category && subcategories.length > 0 && (
                <div className="col-span-2">
                  <Label text={"Subcategories"} />
                  <MultipleCombobox
                    options={subcategories}
                    value={fields.target.subcategories}
                    onValueChange={(subcategories) =>
                      setFields({ ...fields, target: { ...fields.target, subcategories } })
                    }
                    disabled={isLoading}
                    placeholder="Select subcategories"
                  />
                </div>
              )}

              <div className="col-span-2">
                <Label text={"Message"} />
                <Input
                  value={fields.text}
                  onValueChange={(text) => setFields((fields) => ({ ...fields, text }))}
                  disabled={isLoading}
                  placeholder="message"
                />
              </div>

              <div className="col-span-2">
                <Label text={"Media"} />
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    {contentType === "image" && (
                      <FileInput
                        file={localImage}
                        setFile={setLocalImage}
                        accept=".png, .jpg, .jpeg"
                        disabled={isLoading}
                      />
                    )}
                    {contentType === "audio" && (
                      <AudioRecord
                        audio={localAudio}
                        setAudio={setLocalAudio}
                        disabled={isLoading}
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (contentType === "image") {
                          setContentType("text");
                          setLocalImage(null);
                        } else if (contentType === "audio") {
                          setContentType("text");
                          setLocalAudio(null);
                        } else {
                          setContentType("image");
                        }
                      }}
                      className={`p-2 rounded-lg ${
                        contentType === "image"
                          ? "bg-green-100 text-green-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      disabled={isLoading}
                    >
                      <i className="fas fa-image text-lg"></i>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (contentType === "audio") {
                          setContentType("text");
                          setLocalAudio(null);
                        } else if (contentType === "image") {
                          setContentType("text");
                          setLocalImage(null);
                        } else {
                          setContentType("audio");
                        }
                      }}
                      className={`p-2 rounded-lg ${
                        contentType === "audio"
                          ? "bg-green-100 text-green-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      disabled={isLoading}
                    >
                      <i className="fas fa-microphone text-lg"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-span-2 flex items-center gap-x-3">
                <Checkbox
                  id="isActive"
                  value={fields.active}
                  onValueChange={(active) => setFields({ ...fields, active })}
                  disabled={isLoading}
                />
                <label className="text-gray-500" htmlFor="isActive">
                  Active
                </label>
              </div>

              <div className="mt-5 col-span-2">
                <Button btnColor="primary" label="Create" type="submit" isLoading={isLoading} />
              </div>
            </div>
          </form>
        </div>
      </div>
    </Drawer>
  );
};
