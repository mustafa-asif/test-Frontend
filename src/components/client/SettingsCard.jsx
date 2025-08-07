import lodash from "lodash";
import { useState, useEffect, createRef } from "react";
import { useStoreState, useStoreActions } from "easy-peasy";
import { Button } from "../shared/Button";
import { CityCombobox } from "../shared/CityCombobox";
import { Input } from "../shared/Input";
import { FileInput } from "../shared/FileInput";
import { getDifferences, xUploadImage, formatBankNumber } from "../../utils/misc";
import { useToast } from "../../hooks/useToast";
import { xEditUser } from "../../utils/auth";
import { imgSrc } from "../../utils/constants";
import { YoutubeDialog } from "../shared/YoutubeDialog";
import { useTranslation } from "../../i18n/provider";

export const SettingsCard = () => {
  const user = useStoreState((state) => state.auth.user);
  const setUser = useStoreActions((actions) => actions.auth.setUser);
  const editable_fields = getEditableFields(user);  
  const [openYoutube, setOpenYoutube] = useState(false);

  const showToast = useToast();
  const tl = useTranslation();

  const [isLoading, setLoading] = useState(false);
  const [fields, setFields] = useState(editable_fields);
  const [images, setImages] = useState({ brand: null, government: null });

  async function handleSave(e) {
    e.preventDefault();
    if (isLoading) return console.log("send triggered twice");
    const changes = getDifferences(editable_fields, fields); // getChanges;
    setLoading(true);

    if (images.government) {
      const { data, error } = await xUploadImage(images.government);
      if (error) {
        setLoading(false);
        return showToast(error, "error");
      }
      changes["government_image"] = data;
    }

    let img;
    if (images.brand) {
      const { data, error } = await xUploadImage(images.brand);
      if (error) {
        setLoading(false);
        return showToast(error, "error");
      }
      if (!changes["client"]) changes["client"] = {};
      if (!changes["client"]["brand"]) changes["client"]["brand"] = {};
      changes["client"]["brand"]["image"] = data;
      img = data;
    }

    const { data, error } = await xEditUser(user._id, changes);
    setLoading(false);

    if (error) {
      return showToast(error, "error");
    }

    showToast("success", "success");
    setUser(lodash.merge(user, data));
    // if (localStorage.getItem("YT_FIRST") < 2) {
    //   setOpenYoutube(true);
    //   localStorage.setItem("YT_FIRST", (parseInt(localStorage.getItem("YT_FIRST")) || 0) + 1);
    // }
    setTimeout(() => {
      window.location.pathname = "/";
    }, 1000);
  }

  return (
    <div
      className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 rounded-xl"
      style={{
        boxShadow:
          "0px 0px 30px rgba(16, 185, 129, 0.1), inset 0 -10px 15px 0 rgba(16, 185, 129, 0.2)",
      }}>
      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full px-4 max-w-full grow flex-1">
            <h3 className="font-semibold text-xl text-gray-700">{tl("settings")}</h3>
          </div>
        </div>
      </div>

      <div className="block w-full overflow-x-auto">
        <div className="px-5 sm:px-10">
          <form
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 grid-flow-row-dense"
            onSubmit={handleSave}>
            {/* <BrandLogoInput
              image={user.client.brand.image}
              setImage={val => setImages({ ...images, brand: val })}
              disabled={isLoading}
            /> */}
            {/* <div className="col-span-4 sm:col-span-2">
              <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                {tl("email")}
              </label>
              <Input
                type="email"
                value={fields.email}
                onValueChange={(email) => setFields({ ...fields, email })}
                disabled={isLoading}
                required
              />
            </div> */}

            <div className="col-span-4 sm:col-span-2">
              <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                {tl("brand_name")}
              </label>
              <Input
                value={fields.client.brand.name === " " ? "" : fields.client.brand.name}
                maxLength={14}
                minLength={3}
                onValueChange={(name) =>
                  setFields({
                    ...fields,
                    client: { ...fields.client, brand: { ...fields.client.brand, name } },
                  })
                }
                disabled={isLoading}
                required
              />
            </div>
            <div className="col-span-4 sm:col-span-2"></div>

            <div className="col-span-4 sm:col-span-2">
              <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                {tl("full_name")}{" "}
                {user.identity_verified && (
                  <span className="text-green-400 font-bold">
                    {tl("verified")} <i className="fas fa-check-circle"></i>
                  </span>
                )}
              </label>
              <Input
                value={fields.name}
                onValueChange={(name) => setFields({ ...fields, name })}
                disabled={isLoading || user.identity_verified}
                required
              />
            </div>

            <div className="col-span-4 sm:col-span-2">
              <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                {tl("phone")}{" "}
                <span className="text-green-400 font-bold">
                  {tl("verified")} <i className="fas fa-check-circle"></i>
                </span>
              </label>
              <Input
                type="tel"
                pattern="[0-9]*"
                value={fields.phone}
                onChange={(e) => {
                  if (e.target.value.length > 10) return;
                  if (!e.target.validity.valid && !!e.target.value) return;
                  setFields({
                    ...fields,
                    phone: e.target.value,
                  });
                }}
                disabled={true}
                required
              />
            </div>

            <div className="col-span-4 sm:col-span-2">
              <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                {tl("city")}
              </label>
              <CityCombobox
                value={fields.client.location.city}
                onValueChange={(city) =>
                  setFields({
                    ...fields,
                    client: { ...fields.client, location: { ...fields.client.location, city } },
                  })
                }
                disabled={isLoading || user.identity_verified}
              />
            </div>
            <div className="col-span-4 sm:col-span-2">
              <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                {tl("additional_phone")}
              </label>
              <Input
                value={fields.additionalPhone}
                defaultValue={user.additionalPhone}
                onValueChange={(additionalPhone) => {
                  if (additionalPhone.length > 10) return;

                  setFields({ ...fields, additionalPhone })
                }}
              />

            </div>

            {/* <div className="col-span-4 sm:col-span-2">
              <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                {tl("address")}
              </label>
              <Input
                value={fields.client.location.address}
                onValueChange={(address) =>
                  setFields({
                    ...fields,
                    client: { ...fields.client, location: { ...fields.client.location, address } },
                  })
                }
                disabled={isLoading || user.identity_verified}
                required
              />
            </div> */}

            <div className="col-span-4 sm:col-span-2">
              <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                {tl("bank_name")}
              </label>
              <Input
                placeholder={tl("bank_name")}
                value={fields.client.bank.name}
                onValueChange={(name) =>
                  setFields({
                    ...fields,
                    client: { ...fields.client, bank: { ...fields.client.bank, name } },
                  })
                }
                disabled={isLoading || user.identity_verified}
                required
              />
            </div>

            <div className="col-span-4 sm:col-span-2">
              <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                {tl("bank_number")}
              </label>
              <Input
                type="text"
                pattern="[^'\x22]+"
                value={fields.client.bank.number}
                placeholder="000 000 0000000000000000 00"
                onValueChange={(number) =>
                  setFields({
                    ...fields,
                    client: {
                      ...fields.client,
                      bank: { ...fields.client.bank, number: formatBankNumber(number) },
                    },
                  })
                }
                disabled={isLoading || user.identity_verified}
                required
              />
              {user.client.pending_bank?.number && (
                <div className="px-[10px] w-max ml-auto mt-[5px] h-[20px] rounded-full bg-yellow-400 flex gap-x-[5px] items-center justify-center text-xs">
                  <i className="fas fa-exclamation-circle"></i>
                  <span className="font-bold">
                    {formatBankNumber(user.client.pending_bank.number)}
                  </span>

                  <span className="opacity-70">(en attente de validation)</span>
                </div>
              )}
            </div>

            {!user.identity_verified && (
              <>
                {/* <div className="col-span-4 sm:col-span-2">
                  <label className="block mb-2 text-md font-medium text-gray-700 font-sans">{tl("gov_id")}</label>
                  <Input
                    value={user.government_id}
                    onValueChange={government_id => setFields({ ...fields, government_id })}
                    disabled={isLoading}
                    required
                  />
                </div> */}

                {/* <div className="col-span-4 sm:col-span-2">
                  <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                    {tl("gov_image")}{" "}
                    {user.government_image && (
                      <span>
                        ({" "}
                        <a
                          className="text-blue-500 font-bold"
                          href={imgSrc(user.government_image)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="fas fa-eye"></i> {tl("preview")}
                        </a>{" "}
                        )
                      </span>
                    )}
                  </label>
                  <FileInput
                    file={user.government_image}
                    setFile={val => setImages({ ...images, government: val })}
                    disabled={isLoading}
                  />
                </div> */}
              </>
            )}
            <div className="col-span-4 mt-3 mb-10">
              {!user.client.brand.name.trim() && (
                <Button
                  label={tl("start_now")}
                  btnColor="primary"
                  type="submit"
                  isLoading={isLoading}
                  icon="chevron-right"
                  iconPosition="right"
                  className="animate-bounce"
                />
              )}
              {user.client.brand.name.trim() && (
                <Button
                  label={tl("save_changes")}
                  btnColor="secondary"
                  type="submit"
                  isLoading={isLoading}
                />
              )}
            </div>
          </form>
        </div>
      </div>
      <YoutubeDialog
        video="72vnh8J5gJ0"
        playlist="72vnh8J5gJ0"
        open={openYoutube}
        setOpen={setOpenYoutube}
      />
    </div>
  );
};

function BrandLogoInput({ image, setImage, ...props }) {
  const inputRef = createRef();
  const [preview, setPreview] = useState(null);

  function handleFile(e) {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    } else {
      setImage(null);
      setPreview(null);
    }
  }

  function openFileSelect() {
    inputRef.current?.click();
  }

  useEffect(() => {
    setPreview(null);
  }, [image]);

  return (
    <div className="col-span-4">
      <div
        className="relative text-center w-40 h-40 mx-auto cursor-pointer"
        onClick={openFileSelect}>
        <Preview image={image} preview={preview} />
        <div
          className="absolute bottom-0 right-0 w-10 h-10 opacity-100 rounded-full bg-gray-100 hover:bg-gray-200 shadow-lg cursor-pointer"
          {...props}>
          <i className="fas fa-pen text-gray-700 mt-3"></i>
        </div>
        <input type="file" onChange={handleFile} className="hidden" ref={inputRef} />
      </div>
    </div>
  );
}

function Preview({ image, preview }) {
  if (preview) {
    return <img alt="Brand" className="w-40 h-40 rounded-full shadow-lg" src={preview} />;
  }

  if (image) {
    return (
      <img
        alt="Brand"
        className="w-40 h-40 rounded-full shadow-lg"
        src={imgSrc(image, "w_160,h_160")}
      />
    );
  }

  return (
    <div className="absolute top-0 w-full h-full rounded-full bg-green-500 hover:shadow-xl transition duration-300">
      <i className="fas fa-image text-6xl text-white mt-12"></i>
    </div>
  );
}

function getEditableFields(user) {
  return {
    name: user.name,
    // email: user.email,
    phone: user.phone,
    // government_id: user.government_id || "",
    // government_image: user.government_image,
    client: {
      brand: {
        name: user.client.brand.name,
        //  image: user.client.brand.image
      },
      location: {
        city: user.client.location?.city,
        //  address: user.client.location?.address
      },
      bank: {
        number: formatBankNumber(user.client.bank?.number) || "",
        name: user.client.bank?.name || "",
      },
    },
  };
}