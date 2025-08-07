import { Drawer } from "@mui/material";
import { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { useTranslation } from "../../i18n/provider";
import { xAddPickup } from "../../utils/pickups";
import { Button, IconButton } from "../shared/Button";
import { ClientsCombobox } from "../shared/ClientsCombobox";
import { Checkbox, Input } from "../shared/Input";
import { ItemsInput } from "../shared/ItemsInput";
import { useBackClose } from "../shared/LastLocation";
import { PackagingInput } from "../shared/PackagingInput";

const blank_fields = {
  client_id: "",
  items: [],
  comment: "",
  needs_packaging: false,
  packaging_type: "",
};

export const AddPickup = ({ ...props }) => {
  const [fields, setFields] = useState(blank_fields);
  const [createdItems, setCreatedItems] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const showToast = useToast();
  const history = useHistory();
  const onClose = useBackClose("/pickups");
  const tl = useTranslation();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await xAddPickup(fields);
    setLoading(false);
    if (error) {
      return showToast(error, "error");
    }
    resetComponent();
    history.push(`/pickups/${data._id}`);
    return showToast("Succes", "success");
  }

  function resetComponent() {
    setFields(blank_fields);
    setCreatedItems([]);
  }

  return (
    <Drawer anchor="right" onClose={onClose} {...props}>
      <div className="w-screen sm:w-screen/1.5 h-full p-5 sm:p-10">
        {/*  */}
        <div className="mb-6">
          <IconButton icon="arrow-left" className="mr-3" iconColor="gray" onClick={onClose} />
          <span className="text-gray-700 text-lg md:text-2xl uppercase font-semibold">
            {tl("add_onsite_pickup")}
          </span>
        </div>
        {/*  */}
        <div className="pb-10">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3 sm:gap-3">
              {/*  */}
              <div className="col-span-2">
                <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                  {tl("items")}
                </label>
                <ItemsInput
                  value={fields.items}
                  onValueChange={(items) => setFields((fields) => ({ ...fields, items }))}
                  disabled={isLoading | (createdItems.length > 0)}
                />
              </div>
              {/*  */}
              {/*  */}
              <div className="col-span-2">
                <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                  {tl("client")}
                </label>
                <ClientsCombobox
                  value={fields.client_id}
                  onValueChange={(client_id) => setFields((fields) => ({ ...fields, client_id }))}
                  disabled={isLoading || createdItems.length > 0}
                />
              </div>
              {/*  */}
              <div className="col-span-2">
                <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                  {tl("comment")} ({tl("optional")})
                </label>
                <Input
                  value={fields.comment}
                  onValueChange={(comment) => setFields((fields) => ({ ...fields, comment }))}
                  disabled={isLoading || createdItems.length > 0}
                />
              </div>
              {/*  */}
              <div className="col-span-1">
                <label className="block mb-2 text-md font-medium text-gray-700 capitalize">
                  {tl("packaging type")}
                </label>
                <PackagingInput
                  value={fields.packaging_type}
                  onValueChange={(packaging_type) => setFields({ ...fields, packaging_type })}
                  disabled={isLoading || !fields.needs_packaging}
                />
              </div>
              {/*  */}
              <div className="col-span-1 flex items-center gap-x-3 ">
                <Checkbox
                  id="packaging"
                  value={fields.needs_packaging}
                  onValueChange={(needs_packaging) =>
                    setFields((fields) => ({
                      ...fields,
                      needs_packaging,
                      packaging_type: !needs_packaging ? "" : fields.packaging_type,
                    }))
                  }
                  disabled={isLoading}
                />
                <label className="text-gray-500" htmlFor="packaging">
                  {tl("needs packaging")}
                </label>
              </div>

              {/*  */}
              <div className="mt-5 col-span-2 flex">
                <div className="rounded-full w-24 mr-3 text-lg flex items-center font-bold bg-green-50 text-green-500 border border-solid border-green-100 justify-center">
                  {fields.items.length}
                </div>
                <Button
                  label={tl("add_onsite_pickup")}
                  type="submit"
                  icon="dolly"
                  isLoading={isLoading}
                  disabled={fields.items.length < 1 || createdItems.length > 0}
                />
              </div>
              {/*  */}
              {createdItems.length < 1 && (
                <div className="col-span-2 text-right text-link">
                  <Link to="/products/add">
                    <i className="fas fa-boxes"></i> {tl("create_labels")}
                  </Link>
                </div>
              )}
              {/*  */}
            </div>
          </form>
        </div>
      </div>
    </Drawer>
  );
};
