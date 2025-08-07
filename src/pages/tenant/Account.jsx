import lodash from "lodash";
import { useState, useEffect, createRef, Fragment } from "react";
import { useStoreState, useStoreActions } from "easy-peasy";
import { getDifferences, xUploadImage, formatBankNumber } from "../../utils/misc";
import { useToast } from "../../hooks/useToast";
import { xEditUser } from "../../utils/auth";
import { useTranslation } from "../../i18n/provider";
import { Input } from "../../components/shared/Input";

import { FileInput } from "../../components/shared/FileInput";
import { ImagePreview } from "../../components/shared/ImagePreview";
import { Button } from "../../components/shared/Button";
import { ColorBanner } from "../../components/shared/ColorBanner";
import { Card } from "../../components/shared/Card";
import { AgentsCard } from "../../components/tenant/AgentsCard";

export default function AccountPage() {
  const user = useStoreState((state) => state.auth.user);
  const setUser = useStoreActions((actions) => actions.auth.setUser);
  const editable_fields = {
    name: user.name,
    tenant: {
      domain: user.tenant.domain,
      title: user.tenant.title,
      bank: {
        name: user.tenant.bank?.name || "",
        number: user.tenant.bank?.number || "",
      },
      styles: {
        brandLogo: user.tenant.styles.brandLogo || "",
        logoIcon: user.tenant.styles.logoIcon || "",
        favicon: user.tenant.styles.favicon || "",
        primaryColor: user.tenant.styles.primaryColor || "",
        secondaryColor: user.tenant.styles.secondaryColor || "",
        primaryColorAlt: user.tenant.styles.primaryColorAlt || "",
        secondaryColorAlt: user.tenant.styles.secondaryColorAlt || "",
        linkColor: user.tenant.styles.linkColor || "",
        backgroundColor: user.tenant.styles.backgroundColor || "",
      },
    },
  };

  const showToast = useToast();
  const tl = useTranslation();

  const [isLoading, setLoading] = useState(false);
  const [fields, setFields] = useState(editable_fields);
  const [images, setImages] = useState({ brandLogo: null, logoIcon: null, favicon: null });

  async function handleSave(e) {
    e.preventDefault();
    if (isLoading) return;
    const changes = getDifferences(editable_fields, fields); // getChanges;
    setLoading(true);

    if (images.brandLogo) {
      const { data, error } = await xUploadImage(images.brandLogo);
      if (error) {
        setLoading(false);
        return showToast(error, "error");
      }
      changes["tenant"] ??= {};
      changes["tenant"]["styles"] ??= {};
      changes["tenant"]["styles"]["brandLogo"] = data;
    }

    if (images.logoIcon) {
      const { data, error } = await xUploadImage(images.logoIcon);
      if (error) {
        setLoading(false);
        return showToast(error, "error");
      }
      changes["tenant"] ??= {};
      changes["tenant"]["styles"] ??= {};
      changes["tenant"]["styles"]["logoIcon"] = data;
    }

    if (images.favicon) {
      const { data, error } = await xUploadImage(images.favicon);
      if (error) {
        setLoading(false);
        return showToast(error, "error");
      }
      changes["tenant"] ??= {};
      changes["tenant"]["styles"] ??= {};
      changes["tenant"]["styles"]["favicon"] = data;
    }

    if (Object.keys(changes).length < 1) {
      showToast("No changes");
      return setLoading(false);
    }
    const { data, error } = await xEditUser(user._id, changes);
    setLoading(false);

    if (error) {
      return showToast(error, "error");
    }

    showToast("success", "success");
    setUser(lodash.merge(user, data));
  }

  return (
    <Fragment>
      <div className="relative min-h-[50px]">
        <ColorBanner />
      </div>

      <div className="px-4 md:px-10 mx-auto w-full mb-24">
        <div className="flex flex-wrap flex-col justify-center lg:flex-row gap-[20px]">
          {/*  */}
          <Card className="flex-1 max-w-[850px]">
            {/*  */}
            <div className="rounded-t mb-0 px-4 py-3 border-0">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full px-4 max-w-full grow flex-1">
                  <h3 className="font-semibold text-xl text-gray-700">{tl("settings")}</h3>
                </div>
              </div>
            </div>
            {/*  */}
            <div className="block w-full overflow-x-auto">
              {/*  */}
              <form
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 grid-flow-row-dense p-5 sm:px-10"
                onSubmit={handleSave}>
                <div className="col-span-4">
                  <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                    {/* {tl("site_title")} */}
                    Tenant ID
                  </label>

                  <Input defaultValue={user.tenant._id} disabled readOnly />
                </div>
                {/*  */}
                <div className="col-span-4 sm:col-span-2">
                  <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                    {/* {tl("site_title")} */}
                    Site Title
                  </label>

                  <Input
                    value={fields.tenant.title}
                    onValueChange={(title) =>
                      setFields({ ...fields, tenant: { ...fields.tenant, title } })
                    }
                    disabled={isLoading}
                    required
                  />
                </div>
                {/*  */}
                <div className="col-span-4 sm:col-span-2">
                  <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                    {/* {tl("site_title")} */}
                    Site Domain
                  </label>

                  <Input
                    value={fields.tenant.domain}
                    onValueChange={(domain) =>
                      setFields({ ...fields, tenant: { ...fields.tenant, domain } })
                    }
                    disabled={isLoading}
                    required
                  />
                  <div className="text-xs flex items-center gap-x-1 pl-2 pt-2">
                    <i className="fas fa-info-circle"></i>
                    <span>Contact Support for Help Setting Up.</span>
                  </div>
                </div>
                {/*  */}
                <div className="col-span-4 sm:col-span-2">
                  <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                    {tl("bank_number")}
                  </label>
                  <Input
                    type="text"
                    pattern="[^'\x22]+"
                    value={fields.tenant.bank.number}
                    placeholder="000 000 0000000000000000 00"
                    onValueChange={(number) =>
                      setFields({
                        ...fields,
                        tenant: {
                          ...fields.tenant,
                          bank: { ...fields.tenant.bank, number: formatBankNumber(number) },
                        },
                      })
                    }
                    disabled={isLoading || user.tenant.bank?.name}
                    required
                  />
                </div>
                {/*  */}
                <div className="col-span-4 sm:col-span-2">
                  <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                    {tl("bank_name")}
                  </label>
                  <Input
                    placeholder="Bank Name"
                    value={fields.tenant.bank.name}
                    onValueChange={(name) =>
                      setFields({
                        ...fields,
                        tenant: { ...fields.tenant, bank: { ...fields.tenant.bank, name } },
                      })
                    }
                    disabled={isLoading || user.tenant.bank?.name}
                    required
                  />
                </div>
                {/*  */}
                <div className="col-span-4">
                  <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                    {/* {tl("brand logo")} */}
                    Brand Logo
                  </label>
                  <div className="flex items-start gap-x-2 flex-row-reverse">
                    <div className="flex-1">
                      <FileInput
                        file={images.brandLogo}
                        setFile={(brandLogo) => setImages({ ...images, brandLogo })}
                        disabled={isLoading}
                      />
                      <div className="text-xs flex items-center gap-x-1">
                        <i className="fas fa-info-circle"></i>
                        <span className="">Logo on login preferabbly 2:1 </span>
                      </div>
                    </div>
                    <div>
                      <ImagePreview
                        image={images.brandLogo || fields.tenant.styles.brandLogo}
                        style={{
                          width: 140,
                          height: 70,
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </div>
                </div>
                {/*  */}
                <div className="col-span-4">
                  <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                    Logo Icon
                  </label>
                  <div className="flex items-start gap-x-2 flex-row-reverse">
                    <div className="flex-1">
                      <FileInput
                        file={images.logoIcon}
                        setFile={(logoIcon) => setImages({ ...images, logoIcon })}
                        disabled={isLoading}
                      />
                      <div className="text-xs flex items-center gap-x-1">
                        <i className="fas fa-info-circle"></i>
                        <span className="">Logo on login preferabbly 1:1</span>
                      </div>
                    </div>
                    <div>
                      <ImagePreview
                        image={images.logoIcon || fields.tenant.styles.logoIcon}
                        style={{
                          width: 70,
                          height: 70,
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </div>
                </div>
                {/*  */}
                <div className="col-span-4">
                  <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                    Favicon
                  </label>
                  <div className="flex items-start gap-x-2 flex-row-reverse">
                    <div className="flex-1">
                      <FileInput
                        file={images.favicon}
                        setFile={(favicon) => setImages({ ...images, favicon })}
                        disabled={isLoading}
                      />
                      <div className="text-xs flex items-center gap-x-1">
                        <i className="fas fa-info-circle"></i>
                        <span className="">Logo on login preferabbly 32x32</span>
                      </div>
                    </div>
                    <div>
                      <ImagePreview
                        image={images.favicon || fields.tenant.styles.favicon}
                        style={{
                          width: 32,
                          height: 32,
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </div>
                </div>
                {/*  */}
                <div className="col-span-4">
                  <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                    Primary Color
                  </label>
                  <div className="flex gap-x-2 items-center">
                    <div
                      className="shadow-md border border-black block"
                      style={{
                        minHeight: 60,
                        minWidth: 60,
                        backgroundColor: fields.tenant.styles.primaryColor,
                      }}></div>
                    <Input
                      value={fields.tenant.styles.primaryColor}
                      placeholder="#000000"
                      onValueChange={(primaryColor) =>
                        setFields({
                          ...fields,
                          tenant: {
                            ...fields.tenant,
                            styles: { ...fields.tenant.styles, primaryColor },
                          },
                        })
                      }
                      disabled={isLoading}
                    />
                  </div>
                </div>
                {/*  */}
                <div className="col-span-4">
                  <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                    Primary Color Alt (text)
                  </label>
                  <div className="flex gap-x-2 items-center">
                    <div
                      className="shadow-md border border-black block"
                      style={{
                        minHeight: 60,
                        minWidth: 60,
                        backgroundColor: fields.tenant.styles.primaryColorAlt,
                      }}></div>
                    <Input
                      value={fields.tenant.styles.primaryColorAlt}
                      placeholder="#000000"
                      onValueChange={(primaryColorAlt) =>
                        setFields({
                          ...fields,
                          tenant: {
                            ...fields.tenant,
                            styles: { ...fields.tenant.styles, primaryColorAlt },
                          },
                        })
                      }
                      disabled={isLoading}
                    />
                  </div>
                </div>
                {/*  */}
                <div className="col-span-4">
                  <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                    Secondary Color
                  </label>
                  <div className="flex gap-x-2 items-center">
                    <div
                      className="shadow-md border border-black block"
                      style={{
                        minHeight: 60,
                        minWidth: 60,
                        backgroundColor: fields.tenant.styles.secondaryColor,
                      }}></div>
                    <Input
                      value={fields.tenant.styles.secondaryColor}
                      placeholder="#000000"
                      onValueChange={(secondaryColor) =>
                        setFields({
                          ...fields,
                          tenant: {
                            ...fields.tenant,
                            styles: { ...fields.tenant.styles, secondaryColor },
                          },
                        })
                      }
                      disabled={isLoading}
                    />
                  </div>
                </div>
                {/*  */}
                {/*  */}
                <div className="col-span-4">
                  <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                    Secondary Color Alt (text)
                  </label>
                  <div className="flex gap-x-2 items-center">
                    <div
                      className="shadow-md border border-black block"
                      style={{
                        minHeight: 60,
                        minWidth: 60,
                        backgroundColor: fields.tenant.styles.secondaryColorAlt,
                      }}></div>
                    <Input
                      value={fields.tenant.styles.secondaryColorAlt}
                      placeholder="#000000"
                      onValueChange={(secondaryColorAlt) =>
                        setFields({
                          ...fields,
                          tenant: {
                            ...fields.tenant,
                            styles: { ...fields.tenant.styles, secondaryColorAlt },
                          },
                        })
                      }
                      disabled={isLoading}
                    />
                  </div>
                </div>
                {/*  */}
                {/*  */}
                <div className="col-span-4">
                  <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                    Background Color
                  </label>
                  <div className="flex gap-x-2 items-center">
                    <div
                      className="shadow-md border border-black block"
                      style={{
                        minHeight: 60,
                        minWidth: 60,
                        backgroundColor: fields.tenant.styles.backgroundColor,
                      }}></div>
                    <Input
                      value={fields.tenant.styles.backgroundColor}
                      placeholder="#000000"
                      onValueChange={(backgroundColor) =>
                        setFields({
                          ...fields,
                          tenant: {
                            ...fields.tenant,
                            styles: { ...fields.tenant.styles, backgroundColor },
                          },
                        })
                      }
                      disabled={isLoading}
                    />
                  </div>
                </div>
                {/*  */}
                {/*  */}
                <div className="col-span-4">
                  <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                    Link Color
                  </label>
                  <div className="flex gap-x-2 items-center">
                    <div
                      className="shadow-md border border-black block"
                      style={{
                        minHeight: 60,
                        minWidth: 60,
                        backgroundColor: fields.tenant.styles.linkColor,
                      }}></div>
                    <Input
                      value={fields.tenant.styles.linkColor}
                      placeholder="#000000"
                      onValueChange={(linkColor) =>
                        setFields({
                          ...fields,
                          tenant: {
                            ...fields.tenant,
                            styles: { ...fields.tenant.styles, linkColor },
                          },
                        })
                      }
                      disabled={isLoading}
                    />
                  </div>
                </div>
                {/*  */}
                <div className="col-span-4 mt-3 mb-10">
                  <Button
                    label={tl("save_changes")}
                    btnColor="primary"
                    type="submit"
                    isLoading={isLoading}
                  />
                </div>
                {/*  */}
              </form>
              {/*  */}
            </div>
          </Card>
          <AgentsCard />

          {/*  */}
        </div>
      </div>
    </Fragment>
  );
}
