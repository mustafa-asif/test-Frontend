import { useState } from "react";
import { useToast } from "../../hooks/useToast";
import { xFetch } from "../../utils/constants";
import { IconButton } from "./Button";
import { AsyncAutocompleteInput } from "./Input";
import { useConfirmation } from "./ToolsProvider";
import { Pic } from "./Pic";

export const DelivererSelect = ({ _id, model, deliverer, warehouse_id, status }) => {
  const [isLoading, setLoading] = useState(false);
  const [value, setValue] = useState(null);
  const showToast = useToast();

  const confirmAction = useConfirmation();

  async function onDelivererSelect(deliverer_id) {
    if (isLoading) return;
    setLoading(true);
    const { error, data } = await xFetch(`/${model}/${_id}`, {
      method: "PATCH",
      body: { deliverer_id },
    });
    setLoading(false);
    if (error) return showToast(error, "error");
    if (data) showToast("success", "success");
    setValue(null);
  }

  async function onDelivererRemove() {
    if (isLoading) return;
    setLoading(true);
    const { error, data } = await xFetch(`/${model}/${_id}`, {
      method: "PATCH",
      body: { deliverer_id: "" },
    });
    setLoading(false);
    if (error) return showToast(error, "error");
    if (data) showToast("success", "success");
    setValue(null);
  }

  if (!deliverer) {
    if (status !== "pending") {
      return (
        <div className="rounded-full h-10 flex items-center col-span-4 bg-white border-2 border-dashed border-gray-200 text-xl text-gray-400 cursor-default">
          <p className="text-center text-sm flex-1">la commande n'est pas recu par livreur</p>
        </div>
      );
    }
    return (
      <div className="col-span-4 flex gap-x-1">
        {/* <AutocompleteInput
          options={options}
          value={value}
          onValueChange={setValue}
          className="border-dashed border-gray-300 text-center"
          getOptionLabel={(opt) => `${opt.name}`}
          disabled={isLoading || !["pending", "draft", "problem"].includes(status)}
          size={40}
          inputProps={{ placeholder: "pas de livreur" }}
        /> */}
        <AsyncAutocompleteInput
          source_url={`/input_deliverers/options?warehouse_id=${warehouse_id}`}
          value={value}
          onValueChange={setValue}
          className="border-dashed border-gray-300 text-center"
          getOptionLabel={(opt) => `${opt.name}`}
          disabled={isLoading || !["pending", "draft", "problem"].includes(status)}
          size={40}
          inputProps={{ placeholder: "pas de livreur" }}
        />
        <IconButton
          icon="times"
          iconColor="black"
          size="md"
          className="shadow-none hover:shadow-none! border-gray border"
          disabled={!value || isLoading || !["pending", "draft", "problem"].includes(status)}
          onClick={() => setValue(null)}
        />
        <IconButton
          icon="save"
          iconColor="green"
          size="md"
          className="shadow-none hover:shadow-none! border-gray border"
          disabled={!value || isLoading || !["pending", "draft", "problem"].includes(status)}
          onClick={() => onDelivererSelect(value?._id)}
        />
      </div>
    );
  }

  return (
    <div className="col-span-4 flex gap-x-1">
      <div className="rounded-full h-10 flex-1 flex items-center col-span-2 bg-green-100 shadow-sm ">
        <Pic image={deliverer.image} className="mr-2" />
        <a className="line-clamp-1" href={`tel:${deliverer.phone}`}>
          {deliverer.name}
        </a>
      </div>
      {!(status === "cancelled" || status === "fulfilled") && (
        <IconButton
          icon="times"
          iconColor="black"
          size="md"
          className="shadow-none hover:shadow-none! border-gray border"
          disabled={!deliverer || isLoading || !["pending", "draft", "problem"].includes(status)}
          onClick={() =>
            confirmAction({ title: "Supprimer le livreur", onConfirm: onDelivererRemove })
          }
        />
      )}
    </div>
  );
};
