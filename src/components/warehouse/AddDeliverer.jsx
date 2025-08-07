import { Drawer } from "@mui/material";
import { useState } from "react";
import { useToast } from "../../hooks/useToast";
import { xAddDeliverer } from "../../utils/deliverers";
import { Button, IconButton } from "../shared/Button";
import { Input, NumberInput, Checkbox } from "../shared/Input";
import { FileInput } from "../shared/FileInput";
import { useBackClose } from "../shared/LastLocation";
import { xUploadImage } from "../../utils/misc";
import lodash from "lodash";
import { CityCombobox2 } from "../shared/CityCombobox";
import { useTranslation } from "../../i18n/provider";

const blank_fields = {
  name: "",
  phone: "",
  password: "",
  government_id: "",
  government_image: "",
  image: "",
  role: "deliverer",
  active: true,
  deliverer: {
    options: {
      orders: true,
      pickups: true,
      cities: [],
      purges: false,
    },
  },
};

const blank_images = { government_image: "", image: "" };

export const AddDeliverer = ({ ...props }) => {
  const [fields, setFields] = useState(blank_fields);
  const [images, setImages] = useState(blank_images);
  const [isLoading, setLoading] = useState(false);

  const showToast = useToast();
  const tl = useTranslation();
  const onClose = useBackClose("/deliverers");

  async function handleSubmit(e) {
    e.preventDefault();
    let body = lodash.cloneDeep(fields);

    for (let key in images) {
      if (!images[key]) continue;
      const { data, error } = await xUploadImage(images[key]);
      if (error) showToast(`failed to upload ${key}`, "error");
      else body[key] = data;
    }

    setLoading(true);
    const { error } = await xAddDeliverer({ ...body, role: "deliverer" });
    setLoading(false);
    if (error) {
      return showToast(error, "error");
    }
    setFields(blank_fields);
    setImages(blank_images);
    return showToast("Success", "success");
  }

  return (
    <Drawer anchor="right" onClose={onClose} {...props}>
      <div className="w-screen sm:w-screen/1.5 h-full p-5 sm:p-10">
        {/*  */}
        <div className="mb-6">
          <IconButton icon="arrow-left" className="mr-3" iconColor="gray" onClick={onClose} />
          <span className="text-gray-700 text-lg md:text-2xl uppercase font-semibold">
            {tl("add_deliverer")}
          </span>
        </div>
        {/*  */}
        <div className="pb-10">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/*  */}
              <div className="col-span-2">
                <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                  {tl("full_name")}
                </label>
                <Input
                  value={fields.name}
                  onValueChange={(name) => setFields((fields) => ({ ...fields, name }))}
                  disabled={isLoading}
                />
              </div>
              {/*  */}
              {/*  */}
              <div className="col-span-2">
                <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                  {tl("phone")}
                </label>
                <NumberInput
                  value={fields.phone}
                  onValueChange={(phone) => {
                    if (phone.length > 10) return;
                    setFields((fields) => ({ ...fields, phone }));
                  }}
                  disabled={isLoading}
                />
              </div>
              {/*  */}
              {/*  */}
              <div className="col-span-2">
                <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                  {tl("password")}
                </label>
                <Input
                  value={fields.password}
                  onValueChange={(password) => setFields((fields) => ({ ...fields, password }))}
                  disabled={isLoading}
                  type="password"
                />
              </div>
              {/*  */}
              {/*  */}
              <div className="col-span-2">
                <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                  {tl("gov_id")}
                </label>
                <Input
                  value={fields.government_id}
                  onValueChange={(government_id) =>
                    setFields((fields) => ({ ...fields, government_id }))
                  }
                  disabled={isLoading}
                />
              </div>
              {/*  */}
              {/*  */}
              <div className="col-span-2">
                <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                  {tl("gov_image")}
                </label>
                <FileInput
                  file={fields.government_image}
                  setFile={(government_image) =>
                    setImages((images) => ({ ...images, government_image }))
                  }
                  disabled={isLoading}
                />
              </div>
              {/*  */}
              {/*  */}
              <div className="col-span-2">
                <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                  {tl("profile_image") + " (Portrait)"}
                </label>
                <FileInput
                  file={fields.image}
                  setFile={(image) => setImages((images) => ({ ...images, image }))}
                  disabled={isLoading}
                />
              </div>
              {/*  */}
              <div className="col-span-2 flex items-center gap-x-3 mt-2">
                <Checkbox
                  id="isActive"
                  value={fields.active}
                  onValueChange={(active) =>
                    setFields({
                      ...fields,
                      active,
                    })
                  }
                />
                <label className="text-gray-500" htmlFor="isActive">
                  {tl("account_active")}
                </label>
              </div>
              {/*  */}
              <div className="mt-5 col-span-2 md:col-span-4">
                <Button label={tl("add_deliverer")} type="submit" isLoading={isLoading} />
              </div>
              {/*  */}
            </div>
          </form>
        </div>
      </div>
    </Drawer>
  );
};
