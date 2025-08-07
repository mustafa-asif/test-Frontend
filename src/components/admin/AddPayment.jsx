import { useState, useEffect } from "react";
import { Drawer } from "@mui/material";
import { useToast } from "../../hooks/useToast";
import { useBackClose } from "../shared/LastLocation";
import { WarehousesCombobox } from "../shared/WarehousesCombobox";
import { ClientsCombobox } from "../shared/ClientsCombobox";
import { xAddPayment } from "../../utils/cycles";
import { Label } from "../shared/Label";
import { Tab } from "../shared/Tab";
import { Button, IconButton } from "../shared/Button";
import { Checkbox, Input } from "../shared/Input";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "../../i18n/provider";
import { xUploadFile } from "../../utils/misc";

const blank_fields = {
  to_account: "client",
  client_id: "",
  warehouse_id: "",
  medium: "bank",
  file: "",
  amount: "",
  description: "",
  bonus: false,
};

export const AddPayment = ({ ...props }) => {
  const [fields, setFields] = useState(blank_fields);
  const [isLoading, setLoading] = useState(false);

  const showToast = useToast();
  const onClose = useBackClose("/payments");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    let file;
    if (fields.to_account === "admin") {
      // if (!fields.file) {
      //   setLoading(false);
      //   showToast("file is required", "error");
      //   return;
      // }
      
      if(fields.file){
        const { data, error } = await xUploadFile(fields.file);
        if (error) {
          setLoading(false);
          showToast(error, "error");
          return;
        }
        file = data;
      }      
    }

    const { error } = await xAddPayment({
      ...fields,
      amount: fields.to_account === "client" ? -fields.amount : fields.amount,
      to_account: undefined,
      client_id: fields.to_account === "client" ? fields.client_id : undefined,
      warehouse_id: fields.to_account === "warehouse" ? fields.warehouse_id : undefined,
      bonus: fields.to_account !== "client" ? undefined : fields.bonus,
      medium: fields.to_account === "admin" ? fields.medium : undefined,
      file: fields.to_account === "admin" ? file : undefined,
    });

    setLoading(false);
    if (error) {
      return showToast(error, "error");
    }
    setFields({ ...blank_fields, to_account: fields.to_account });
    return showToast("Success", "success");
  }

  return (
    <Drawer anchor="right" onClose={onClose} {...props}>
      <div className="w-screen sm:w-screen/1.5 h-full p-5 sm:p-10">
        {/*  */}
        <div className="mb-6">
          <IconButton icon="arrow-left" className="mr-3" iconColor="gray" onClick={onClose} />
          <span className="text-gray-700 text-lg md:text-2xl uppercase font-semibold">
            {"Créer un paiement"}
          </span>
        </div>
        {/*  */}
        <div className="pb-10">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3 sm:gap-3">
              {/*  */}
              <div className="col-span-2">
                <Tab
                  value={fields.to_account}
                  onValueChange={(to_account) => setFields({ ...fields, to_account })}
                  options={[
                    { value: "admin", label: "Admin" },
                    { value: "warehouse", label: "Warehouse" },
                    { value: "client", label: "Client" },
                  ]}
                />
              </div>
              {/*  */}
              <div className={`col-span-2 ${fields.to_account !== "warehouse" ? "hidden" : ""}`}>
                <Label text={"Warehouse"} />
                <WarehousesCombobox
                  value={fields.warehouse_id}
                  onValueChange={(warehouse_id) =>
                    setFields((fields) => ({ ...fields, warehouse_id }))
                  }
                  disabled={isLoading}
                />
              </div>
              {/*  */}
              <div className={`col-span-2 ${fields.to_account !== "client" ? "hidden" : ""}`}>
                <Label text={"Client"} />
                <ClientsCombobox
                  value={fields.client_id}
                  onValueChange={(client_id) => setFields((fields) => ({ ...fields, client_id }))}
                  disabled={isLoading}
                />
              </div>
              {/*  */}
              <div className={`col-span-2 ${fields.to_account !== "admin" ? "hidden" : ""}`}>
                <div className="flex my-2">
                  <label className="block text-md font-medium text-gray-700 font-sans mr-3">
                    {"Moyen de paiement"}
                  </label>
                  <input
                    type="radio"
                    className="hidden"
                    checked={fields.medium === "bank"}
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="radio1"
                    className="flex items-center cursor-pointer mr-3"
                    onClick={() => {
                      if (isLoading) return;
                      setFields((fields) => ({ ...fields, medium: "bank" }));
                    }}>
                    <span className="w-4 h-4 inline-block mr-2 border border-gray"></span>
                    <i className="fas fa-university pr-1"></i>Bank
                  </label>

                  <input
                    type="radio"
                    className="hidden"
                    checked={fields.medium === "cash"}
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="radio2"
                    className="flex items-center cursor-pointer"
                    onClick={() => {
                      if (isLoading) return;
                      setFields((fields) => ({ ...fields, medium: "cash" }));
                    }}>
                    <span className="w-4 h-4 inline-block mr-2 border border-gray"></span>
                    <i className="fas fa-hand-holding-usd pr-1"></i>Cash
                  </label>
                </div>
              </div>
              {/*  */}
              <div className="col-span-2">
                <Label text={"Montant"} />
                <div className="relative inline-block w-full">
                  <Input
                    value={fields.amount}
                    onValueChange={(amount) => setFields((fields) => ({ ...fields, amount }))}
                    disabled={isLoading}
                  />
                  <div className="absolute right-5 top-2.5 text-xl">
                    <span className={`text-${fields.amount >= 0 ? "green" : "red"}-500`}>
                      {fields.to_account} va {getVerb(fields.amount, fields.to_account)}
                    </span>
                  </div>
                </div>
              </div>
              {/*  */}
              <div className="col-span-2">
                <Label text={"Description"} />
                <Input
                  value={fields.description}
                  onValueChange={(description) =>
                    setFields((fields) => ({ ...fields, description }))
                  }
                  disabled={isLoading}
                />
              </div>
              {/*  */}
              <div
                className={`col-span-2 flex items-center gap-x-3  ${
                  fields.to_account !== "client" ? "hidden" : ""
                }`}>
                <Checkbox
                  id="isBonus"
                  value={fields.bonus}
                  onValueChange={(bonus) => setFields({ ...fields, bonus })}
                />
                <label className="text-gray-500" htmlFor="isBonus">
                  Bonus
                </label>
              </div>

              <div className={`col-span-2 ${fields.to_account !== "admin" ? "hidden" : ""}`}>
                <DropInput
                  value={fields.file?.name}
                  isLoading={isLoading}
                  onValueChange={(file) => setFields((fields) => ({ ...fields, file }))}
                />
              </div>
              {/*  */}
              <div className="mt-5 col-span-2">
                <Button
                  btnColor="primary"
                  label="Créer un paiement"
                  type="submit"
                  isLoading={isLoading}
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

function DropInput({ onValueChange, isLoading, value }) {
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: ".pdf, .doc, .png, .jpg, .jpeg",
  });

  useEffect(() => {
    if (acceptedFiles.length) {
      console.log("file uploaded.");
      onValueChange(acceptedFiles[0]);
    }
  }, [acceptedFiles]);

  const tl = useTranslation();

  return (
    <>
      <div
        {...getRootProps({
          style: { height: 125 },
          className:
            "relative bg-gray-100 hover:bg-gray-50 border-dashed border-4 flex items-center justify-center flex-col cursor-pointer mt-5 mb-1",
          disabled: isLoading,
        })}>
        <input {...getInputProps()} />
        {isLoading ? (
          <p>... </p>
        ) : !value ? (
          <>
            <i className="z-40 fas fa-file-upload text-6xl left-6 text-gray-200 absolute"></i>
            <p className="z-50 text-lg">Glissez et déposez un fichier .pdf .doc .png .jpg .jpeg</p>
          </>
        ) : (
          <>
            <i className="z-40 fas fa-file-upload text-6xl left-6 text-gray-200 absolute"></i>
            <p className="z-50 text-lg">{value}</p>
          </>
        )}
      </div>
    </>
  );
}

function getVerb(amount, to_account) {
  if (to_account === "admin") {
    return amount >= 0 ? "recevoir" : "payer";
  }
  return amount >= 0 ? "payer" : "recevoir";
}
