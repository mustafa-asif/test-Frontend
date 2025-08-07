import { Drawer } from "@mui/material";
import { useState } from "react";
import { useToast } from "../../hooks/useToast";
import { useTranslation } from "../../i18n/provider";
import { xFetch } from "../../utils/constants";
import { Button, IconButton } from "../shared/Button";
import { Input } from "../shared/Input";
import { useBackClose } from "../shared/LastLocation";

const blank_fields = {
  title: "",
};

export const AddReclamation = ({ ...props }) => {
  const [fields, setFields] = useState(blank_fields);
  const [isLoading, setLoading] = useState(false);

  const showToast = useToast();
  const tl = useTranslation();
  const onClose = useBackClose("/tickets");

  async function handleOpen(e) {
    e.preventDefault();
    setLoading(true);
    const { error, data } = await xFetch(`/tickets`, { method: "POST", body: fields });
    setLoading(false);
    if (error) {
      return showToast(error, "error");
    }
    setFields(blank_fields);
    showToast("Succes", "success");
    console.log(data);
  }

  return (
    <Drawer anchor="right" onClose={onClose} {...props}>
      <div className="w-screen sm:w-screen/1.5 h-full p-5 sm:p-10">
        {/*  */}
        <div className="mb-6">
          <IconButton icon="arrow-left" className="mr-3" iconColor="gray" onClick={onClose} />
          <span className="text-gray-700 text-lg md:text-2xl uppercase font-semibold">
            {tl("open_reclamation")}
          </span>
        </div>
        {/*  */}
        <div className="pb-10">
          <form onSubmit={handleOpen}>
            <div className="grid grid-cols-2 gap-3 sm:gap-3">
              <div className="col-span-2">
                <label className="block mb-2 text-md font-medium text-gray-700 font-sans">
                  {tl("title")}
                </label>
                <Input
                  value={fields.title}
                  onValueChange={(title) => setFields((fields) => ({ ...fields, title }))}
                  disabled={isLoading}
                />
              </div>
              {/*  */}
              <div className="mt-5 col-span-2">
                <Button label={tl("open_reclamation")} type="submit" isLoading={isLoading} />
              </div>
              {/*  */}
            </div>
          </form>
        </div>
      </div>
    </Drawer>
  );
};
