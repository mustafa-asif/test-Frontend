import { Drawer } from "@mui/material";
import { useStoreActions } from "easy-peasy";
import { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { useTranslation } from "../../i18n/provider";
import { xAddPayment } from "../../utils/cycles";
import { xAddPickup } from "../../utils/pickups";
import { Button, IconButton } from "../shared/Button";
import { ClientsCombobox } from "../shared/ClientsCombobox";
import { Input, NumberInput } from "../shared/Input";
import { useBackClose } from "../shared/LastLocation";
import { usePrint } from "../shared/ToolsProvider";

const blank_fields = {
  client_id: "",
  amount: "",
  description: "",
};

export const AddInvoice = ({ ...props }) => {
  const [fields, setFields] = useState(blank_fields);
  const [isLoading, setLoading] = useState(false);

  const addInvoice = useStoreActions((actions) => actions.invoices.addInvoice);

  const showToast = useToast();
  const tl = useTranslation();
  const onClose = useBackClose("/invoices");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const { error, data } = await xAddPayment({ ...fields, amount: fields.amount * -1 });
    setLoading(false);
    if (error) {
      return showToast(error, "error");
    }
    setFields(blank_fields);
    // addInvoice(data); modified data not accounted for.
    return showToast("Succes", "success");
  }

  return (
    <Drawer anchor="right" onClose={onClose} {...props}>
      <div className="w-screen sm:w-screen/1.5 h-full p-5 sm:p-10">
        {/*  */}
        <div className="mb-6">
          <IconButton icon="arrow-left" className="mr-3" iconColor="gray" onClick={onClose} />
          <span className="text-gray-700 text-lg md:text-2xl uppercase font-semibold">
            {tl("add_invoice")}
          </span>
        </div>
        {/*  */}
        <div className="pb-10">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3 sm:gap-3">
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
                  {tl("amount")}
                </label>
                <NumberInput
                  value={fields.amount}
                  onValueChange={(amount) => setFields((fields) => ({ ...fields, amount }))}
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
              <div className="mt-5 col-span-2">
                <Button label={tl("add_invoice")} type="submit" isLoading={isLoading} />
              </div>
              {/*  */}
            </div>
          </form>
        </div>
      </div>
    </Drawer>
  );
};
