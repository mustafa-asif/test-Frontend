import { Fragment, useState, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import { xFetch } from "../../utils/constants";
import { xUploadImage, xUploadAudio } from "../../utils/misc";
import { Button, IconButton } from "../shared/Button";
import { Label } from "../shared/Label";
import { AutocompleteInput, Checkbox, Input } from "../shared/Input";
import { MultipleCombobox } from "../shared/MultipleCombobox";
import { getDifferences } from "../../utils/misc";
import { FileInput } from "../shared/FileInput";
import { AudioRecord } from "../shared/AudioRecord";
import { Image } from "../shared/Image";
import { Audio } from "../shared/Audio";
import { ImagePreview } from "../shared/ImagePreview";
import common from "./common";

export const EditAutoMessage = ({ document: autoMessage, handleDrawerClose, ...props }) => {
  const [originalFields, setOriginalFields] = useState({
    text: autoMessage.text,
    active: autoMessage.active,
    target: {
      pages: autoMessage.target.pages,
      status: autoMessage.target.status,
      category: autoMessage.target.category,
      subcategories: autoMessage.target.subcategories || [],
    },
    media: autoMessage.media,
  });

  const [fields, setFields] = useState(originalFields);
  const [isLoading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [contentType, setContentType] = useState(
    autoMessage.media ? autoMessage.media.kind : "text",
  );
  const [localImage, setLocalImage] = useState(null);
  const [localAudio, setLocalAudio] = useState(null);

  const showToast = useToast();

  useEffect(() => {
    if (autoMessage.media) {
      setContentType(autoMessage.media.kind);
    } else {
      setContentType("text");
    }
  }, [autoMessage]);

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

      if (uniqueCategories.length > 0 && !uniqueCategories.includes(fields.target.category)) {
        setFields((prev) => ({
          ...prev,
          target: {
            ...prev.target,
            category: "",
            subcategories: [],
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

  async function handleSave(e) {
    e.preventDefault();

    if (contentType === "text" && !fields.text) {
      setLoading(false);
      showToast("Message text is required", "error");
      return;
    }
    if (contentType === "image" && !localImage && !fields.media) {
      setLoading(false);
      showToast("Image is required", "error");
      return;
    }
    if (contentType === "audio" && !localAudio && !fields.media) {
      setLoading(false);
      showToast("Audio is required", "error");
      return;
    }

    let media = null;
    if (contentType === "image") {
      if (localImage) {
        const { data, error } = await xUploadImage(localImage);
        if (error) {
          setLoading(false);
          return showToast(error, "error");
        }
        media = { kind: "image", link: data };
      } else if (fields.media?.kind === "image") {
        media = { kind: "image", link: fields.media.link };
      }
    } else if (contentType === "audio") {
      if (localAudio) {
        const { data, error } = await xUploadAudio(localAudio);
        if (error) {
          setLoading(false);
          return showToast(error, "error");
        }
        media = { kind: "audio", link: data };
      } else if (fields.media?.kind === "audio") {
        media = { kind: "audio", link: fields.media.link };
      }
    }

    const updatedFields = {
      ...fields,
      media,
    };

    const changes = getDifferences(originalFields, updatedFields);

    if (changes.media) {
      if (contentType === "text") {
        changes.media = null;
      } else if (contentType === "image") {
        changes.media = { kind: "image", link: changes.media.link };
      } else if (contentType === "audio") {
        changes.media = { kind: "audio", link: changes.media.link };
      }
    }

    if (Object.keys(changes).length < 1) return;
    setLoading(true);

    if (changes?.target?.pages) {
      changes.target.pages = [changes?.target?.pages];
      if (changes.target.pages[0] !== "/orders") {
        delete changes.target.status;
      }
    }

    const { error } = await xFetch(`/autoMessages/${autoMessage._id}`, {
      method: "PATCH",
      body: changes,
    });
    setLoading(false);
    if (error) {
      return showToast(error, "error");
    }

    setOriginalFields(updatedFields);
    setFields(updatedFields);

    return showToast("success", "success");
  }

  const isOrder = () => {
    if (Array.isArray(fields.target.pages) && fields.target.pages[0] === "/orders") {
      return true;
    }

    if (fields.target.pages === "/orders") {
      return true;
    }

    return false;
  };

  return (
    <Fragment>
      <div className="mb-6">
        <IconButton icon="arrow-left" className="mr-2" onClick={handleDrawerClose} />
        <span className="text-gray-700 text-lg md:text-2xl uppercase font-semibold">
          Edit Auto Message <span className="lowercase text-gray-500">{autoMessage._id}</span>{" "}
        </span>
      </div>
      <div className="pb-10">
        <form onSubmit={handleSave}>
          <div className="flex flex-col gap-x-3 gap-y-5">
            <div className="col-span-2">
              <Label text={"Target Page"} />
              <AutocompleteInput
                options={common.allowedPages}
                value={fields.target.pages}
                onValueChange={(pages) =>
                  setFields({ ...fields, target: { ...fields.target, pages } })
                }
                disabled={isLoading}
                placeholder="pages"
              />
            </div>

            {isOrder() && (
              <div className="col-span-2">
                <Label text={"Target order status"} />
                <AutocompleteInput
                  options={common.orderStatuses}
                  value={fields.target.status}
                  onValueChange={(status) =>
                    setFields({ ...fields, target: { ...fields.target, status } })
                  }
                  disabled={isLoading}
                  placeholder="status"
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
                    <AudioRecord audio={localAudio} setAudio={setLocalAudio} disabled={isLoading} />
                  )}
                  {!localImage && !localAudio && fields.media?.kind === "image" && (
                    <div className="mt-2">
                      <Image
                        className="rounded-xl overflow-hidden block"
                        public_id={fields.media.link}
                        preview_transformations="w_200"
                      />
                    </div>
                  )}
                  {!localAudio && fields.media?.kind === "audio" && (
                    <div className="mt-2">
                      <Audio className="agent" public_id={fields.media.link} />
                    </div>
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

            <div className="mt-5 col-span-2 md:col-span-4 flex flex-col gap-y-3">
              <Button
                label="Save Changes"
                btnColor="secondary"
                type="button"
                isLoading={isLoading}
                onClick={handleSave}
                className="mb-1"
              />
            </div>
          </div>
        </form>
      </div>
    </Fragment>
  );
};
