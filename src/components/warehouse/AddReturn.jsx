import { Drawer } from "@mui/material";
import { useState } from "react";
import { useToast } from "../../hooks/useToast";
import { xAddPurge } from "../../utils/purges";
import { Button, IconButton } from "../shared/Button";
import { Checkbox, Input } from "../shared/Input";
import { ClientsCombobox } from "../shared/ClientsCombobox";
import { ItemsInput } from "../shared/ItemsInput";
import { useBackClose } from "../shared/LastLocation";
import { useTranslation } from "../../i18n/provider";

const blank_fields = {
  client_id: "",
  description: "",
  items: [],
  show_client: false,
};

export const AddReturn = ({ ...props }) => {
  const [fields, setFields] = useState(blank_fields);
  const [isLoading, setLoading] = useState(false);

  const showToast = useToast();
  const tl = useTranslation();
  const onClose = useBackClose("/returns");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const { error } = await xAddPurge(fields);
    setLoading(false);
    if (error) {
      return showToast(error, "error");
    }
    setFields(blank_fields);
    return showToast("Succes", "success");
  }

  return (
    <Drawer anchor="right" onClose={onClose} {...props}>
      <div className="w-screen sm:w-screen/1.5 h-full p-5 sm:p-10">
        {/*  */}
        <div className="mb-6">
          <IconButton icon="arrow-left" className="mr-3" iconColor="gray" onClick={onClose} />
          <span className="text-gray-700 text-lg md:text-2xl uppercase font-semibold">
            {tl("add_onsite_return")}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>
              {/*  */}
              <div className="col-span-2">
                <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                  {tl("description")}
                </label>
                <Input
                  value={fields.description}
                  onValueChange={(description) =>
                    setFields((fields) => ({ ...fields, description }))
                  }
                  disabled={isLoading}
                />
              </div>
              {/*  */}
              <div className="col-span-2 flex items-center gap-x-3 mt-2">
                <Checkbox
                  id="showClient"
                  value={fields.show_client}
                  onValueChange={(show_client) =>
                    setFields({
                      ...fields,
                      show_client,
                    })
                  }
                />
                <label className="text-gray-500" htmlFor="showClient">
                  {tl("montrer au client")}
                </label>
              </div>
              <div className="mt-5 col-span-2 flex">
                <div className="rounded-full w-24 mr-3 text-lg flex items-center font-bold bg-green-50 text-green-500 border border-solid border-green-100 justify-center">
                  {fields.items.length}
                </div>
                <Button
                  label={tl("add_onsite_return")}
                  type="submit"
                  isLoading={isLoading}
                  disabled={fields.items.length < 1}
                />
              </div>
              {/*  */}
            </div>
          </form>
        </div>
      </div>
    </Drawer>
  );
};
