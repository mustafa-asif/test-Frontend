import { Fragment, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { imgSrc, xFetch } from "../../utils/constants";
import { Button, IconButton } from "../shared/Button";
import { Label } from "../shared/Label";
import { Checkbox, Input } from "../shared/Input";
import { FileInput } from "../shared/FileInput";
import { useConfirmation } from "../shared/ToolsProvider";
import { xLogin } from "../../utils/auth";
import { formatBankNumber, getDifferences, xUploadImage } from "../../utils/misc";
import { PackInput } from "./PackInput";
import { useTranslation } from "../../i18n/provider";
import { UserSelect } from "../shared/UserSelect";
import { useStoreState } from "easy-peasy";
import { sendSystemEvent } from '../../services/systemEvents';

export const EditClient = ({ document: user, handleDrawerClose, ...props }) => {
  const original_fields = {
    active: user.active,
    government_id: user.government_id,
    identity_verified: user.identity_verified,
    name: user.name,
    password: "",
    client: {
      brand: user.client.brand,
      pack: user.client.pack || "",
      bank: user.client.bank,
      upsell: user.client.upsell,
      lock_items: user.client.lock_items,
      assigned_commercial: { _id: user.client.assigned_commercial?._id || "" },
      display_warehouse_deliverer_contact: !!user.client.display_warehouse_deliverer_contact,
      display_client_team_member_contact: !!user.client.display_client_team_member_contact,
    },
  };

  console.log('>>>> ', user)

  const [fields, setFields] = useState(original_fields);
  const [images, setImages] = useState({ logo: null });
  const [isLoading, setLoading] = useState(false);

  const confirmAction = useConfirmation();
  const showToast = useToast();
  const tl = useTranslation();
  const authUser = useStoreState((state) => state.auth.user);

  async function handleSave(e) {
    let body = fields;
    e.preventDefault();
    if (images.logo) {
      setLoading(true);
      const { data, error } = await xUploadImage(images.logo);
      if (error) {
        setLoading(false);
        return showToast(error, "error");
      }
      body.client ??= {};
      body.client.brand ??= {};
      body.client.brand.image = data;
    }
    const changes = getDifferences(original_fields, body);
    console.log("changes, ", changes);

    if (Object.keys(changes).length < 1) return;
    setLoading(true);
    const { error } = await xFetch(`/users/${user._id}`, { method: "PATCH", body: changes });
    setLoading(false);
    if (error) {
      return showToast(error, "error");
    }
    return showToast("success", "success");
  }

  async function loginAsClient() {
    setLoading(true);
    const { data, error } = await xLogin({ phone: user.phone });
    setLoading(false);
    if (error) return showToast(error, "error");
    else if (data) {
      await sendSystemEvent(authUser, {
        type: 'login_as_client',
        client: {
          _id: user._id,
          name: user.name,
          phone: user.phone
        },
        timestamp: new Date().toISOString()
      });
      window.location.replace("/account");
    }
  }

  return (
    <Fragment>
      <div className="mb-6">
        <IconButton icon="arrow-left" className="mr-2" onClick={handleDrawerClose} />
        <span className="text-gray-700 text-lg md:text-2xl uppercase font-semibold">
          {tl("edit_client")} <span className="lowercase text-gray-500">{user._id}</span>
        </span>
      </div>
      <div className="pb-10">
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/*  */}
            <div className="col-span-2">
              <Label text={tl("name")} />
              <Input
                value={fields.name}
                onValueChange={(name) => setFields({ ...fields, name })}
                disabled={isLoading}
              />
            </div>
            {/*  */}
            <div className="col-span-2">
              <Label text={tl("phone")} />
              <Input defaultValue={user.phone} readOnly />
            </div>
            {/*  */}
            <div className="col-span-2">
              <Label text={tl("gov_id")} />
              <Input
                value={fields.government_id}
                onValueChange={(government_id) => setFields({ ...fields, government_id })}
                disabled={isLoading}
              />
            </div>
            {/*  */}
            <div className="col-span-2">
              <Label text={tl("gov_image")} className="inline-flex mr-3 mb-2" />
              {user.government_image && (
                <span>
                  ({" "}
                  <a
                    className="text-blue-500 font-bold"
                    href={imgSrc(user.government_image)}
                    target="_blank"
                    rel="noreferrer">
                    <i className="fas fa-eye"></i> {tl("preview")}
                  </a>{" "}
                  )
                </span>
              )}
              <Input defaultValue={user.government_image} readOnly />
            </div>
            {/*  */}
            <div className="col-span-2">
              <Label text={tl("city")} />
              <Input defaultValue={user.client.location?.city} readOnly />
            </div>
            {/*  */}
            <div className="col-span-2">
              <Label text={tl("address")} />
              <Input defaultValue={user.client.location?.address} readOnly />
            </div>
            {/*  */}
            <div className="col-span-2">
              <Label text={tl("bank_number")} />
              <Input
                value={fields.client.bank?.number}
                onValueChange={(number) =>
                  setFields({
                    ...fields,
                    client: { ...fields.client, bank: { ...fields.client.bank, number } },
                  })
                }
                disabled={isLoading}
              />
              {user.client.pending_bank?.number && (
                <div className="flex-wrap w-full px-[10px] py-[2px] ml-auto mt-[5px] min-h-[20px] rounded-full bg-yellow-300 flex gap-x-[5px] items-center justify-center text-xs">
                  <i className="fas fa-exclamation-circle"></i>
                  <span className="font-bold">
                    {formatBankNumber(user.client.pending_bank.number)}
                  </span>

                  <span className="opacity-70">(en attente de validation)</span>
                </div>
              )}
            </div>
            {/*  */}
            <div className="col-span-2">
              <Label text={tl("bank_name")} />
              <Input
                value={fields.client.bank?.name}
                onValueChange={(name) =>
                  setFields({
                    ...fields,
                    client: { ...fields.client, bank: { ...fields.client.bank, name } },
                  })
                }
                disabled={isLoading}
              />
              {user.client.pending_bank?.name && (
                <div className="flex-wrap w-full px-[10px] py-[2px] ml-auto mt-[5px] min-h-[20px] rounded-full bg-yellow-300 flex gap-x-[5px] items-center justify-center text-xs">
                  <i className="fas fa-exclamation-circle"></i>
                  <div className="font-bold">{user.client.pending_bank.name}</div>
                  <span className="opacity-70">(en attente de validation)</span>
                </div>
              )}
            </div>
            {/*  */}
            <div className="col-span-2">
              <Label text="Pack" />
              <PackInput
                value={fields.client.pack}
                onValueChange={(pack) =>
                  setFields({
                    ...fields,
                    client: { ...fields.client, pack },
                  })
                }
                disabled={isLoading}
              />
            </div>
            {/*  */}
            <div className="col-span-2">
              <Label text={tl("brand_name")} />
              <Input
                value={fields.client.brand.name}
                onValueChange={(name) =>
                  setFields({
                    ...fields,
                    client: { ...fields.client, brand: { ...fields.client.brand, name } },
                  })
                }
                disabled={isLoading}
              />
            </div>
            {/*  */}
            <div className="col-span-2">
              <Label text="Brand logo" className="inline-flex mr-3 mb-2" />
              {user.client.brand.image && (
                <span>
                  ({" "}
                  <a
                    className="text-blue-500 font-bold"
                    href={imgSrc(user.client.brand.image)}
                    target="_blank"
                    rel="noreferrer">
                    <i className="fas fa-eye"></i> {tl("preview")}
                  </a>{" "}
                  )
                </span>
              )}
              <FileInput
                file={fields.client.brand.image}
                setFile={(logo) => setImages({ ...images, logo })}
                disabled={isLoading}
              />
            </div>
            {/*  */}
            {authUser?.isMainUser && (
              <>
                <div className="col-span-2">
                  <Label text="Assigned Commercial" className="inline-flex mr-3 mb-2" />
                  <UserSelect
                    filters={["role=commercial"]}
                    value={fields.client.assigned_commercial?._id}
                    onValueChange={(_id) =>
                      setFields({
                        ...fields,
                        client: {
                          ...fields.client,
                          assigned_commercial: { ...fields.assigned_commercial, _id },
                        },
                      })
                    }
                    disabled={isLoading}
                  />
                </div>
                <div className="col-span-2"></div>
              </>
            )}

            {/*  */}
            <div className="col-span-2 flex items-center gap-x-3">
              <Checkbox
                id="upsell"
                value={fields.client.upsell}
                onValueChange={(upsell) =>
                  setFields({
                    ...fields,
                    client: { ...fields.client, upsell },
                  })
                }
                disabled={isLoading}
              />{" "}
              <Label text={"Upsell"} htmlFor="upsell" />
            </div>
            {/*  */}
            <div className="col-span-2 flex items-center gap-x-3">
              <Checkbox
                id="lock_items"
                value={fields.client.lock_items}
                onValueChange={(lock_items) =>
                  setFields({
                    ...fields,
                    client: { ...fields.client, lock_items },
                  })
                }
                disabled={isLoading}
              />{" "}
              <Label text={"lock_items"} htmlFor="lock_items" />
            </div>
            <div className="col-span-2 flex items-center gap-x-3">
              <Checkbox
                id="display_warehouse_deliverer_contact"
                value={fields.client.display_warehouse_deliverer_contact}
                onValueChange={(display_warehouse_deliverer_contact) =>
                  setFields({
                    ...fields,
                    client: { ...fields.client, display_warehouse_deliverer_contact },
                  })
                }
                disabled={isLoading}
              />{" "}
              <Label
                text={"Display Warehouse/Deliverer Contact"}
                htmlFor="display_warehouse_deliverer_contact"
              />
            </div>
            <div className="col-span-2 flex items-center gap-x-3">
              <Checkbox
                id="display_client_team_member_contact"
                value={fields.client.display_client_team_member_contact}
                onValueChange={(display_client_team_member_contact) =>
                  setFields({
                    ...fields,
                    client: { ...fields.client, display_client_team_member_contact },
                  })
                }
                disabled={isLoading}
              />{" "}
              <Label
                text={"Display Client/Team Member Contact"}
                htmlFor="display_client_team_member_contact"
              />
            </div>
            {/*  */}
            <div className="col-span-2 md:col-span-4 flex items-center gap-x-3">
              <Checkbox
                id="isActive"
                value={fields.active}
                onValueChange={(active) => setFields({ ...fields, active })}
                disabled={isLoading}
              />{" "}
              <Label text="User Active" htmlFor="isActive" />
            </div>
            {/*  */}
            <div className="col-span-2 md:col-span-4 flex items-center gap-x-3">
              <Checkbox
                id="isVerified"
                value={fields.identity_verified}
                onValueChange={(identity_verified) => setFields({ ...fields, identity_verified })}
                disabled={isLoading || user.identity_verified}
              />{" "}
              <Label text={tl("verified")} htmlFor="isVerified" />
            </div>
            {/*  */}
            <div className="mt-5 col-span-2 md:col-span-4 flex flex-col gap-y-3">
              <Button
                label={tl("save_changes")}
                btnColor="secondary"
                type="button"
                isLoading={isLoading}
                onClick={handleSave}
                className="mb-1"
              />
              {!user.client.disable_connect_as_client_from_commercial && (
                <Button
                  label={tl("login_as_client")}
                  icon="user"
                  type="button"
                  disabled={isLoading}
                  onClick={() =>
                    confirmAction({ title: `Login as ${user.name}`, onConfirm: loginAsClient })
                  }
                />
              )}
            </div>
            {/*  */}
          </div>
        </form>
      </div>
    </Fragment>
  );
};
