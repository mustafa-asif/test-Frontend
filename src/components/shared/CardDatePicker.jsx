import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import frLocale from "date-fns/locale/fr";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { cl, formatDate } from "../../utils/misc";
import PostponedSelectorDialog from "./PostponedSelectorDialog";
import { useToast } from "../../hooks/useToast";
import { xFetch } from "../../utils/constants";

export const CardDatePicker = ({
  model,
  _id,
  date,
  editDocument,
  opensMessages,
  isSmall,
  ...props
}) => {
  // date is wrong
  const [value, setValue] = useState(date ? new Date(date) : null);
  const [openPostponedDialog, setOpenPostponedDialog] = useState(false);
  const showToast = useToast();

  const history = useHistory();

  function handleDateChange(value) {
    // if clear
    if (!!date && !value) {
      editDocument({ desired_date: "" }, undefined);
      return;
    }

    setOpenPostponedDialog(true);
    return;
  }

  async function sendSelectionAsMessage(postponedBy) {
    const postponedMessages = {
      client: `reporter par le client ${formatDate(value, false)}`,
      livreur: `programme par le livreur ${formatDate(value, false)}`,
    };
    const { error } = await xFetch(`/${model}/${_id}/messages`, {
      method: "POST",
      body: { text: postponedMessages[postponedBy] },
    });
    if (error) {
      return showToast(error, "error");
    }
    // showToast("success", "success");
  }

  function closePostponedDialog() {
    setOpenPostponedDialog(false);
  }

  async function onSelectPostponedBy(postponedBy) {
    if (!value) return;
    let callback = undefined;
    if (opensMessages) {
      callback = () => history.push(`/${model}/${_id}/chat`);
    }
    await sendSelectionAsMessage(postponedBy);
    editDocument({ desired_date: formatDate(value, true), postponedBy }, undefined, callback);
    closePostponedDialog();
  }

  const theme = createTheme({
    palette: {
      primary: {
        main: "#FBBF24",
        contrastText: "#ffffff",
      },
      text: {
        primary: "#334155",
        hint: "#CBD5E1",
      },
    },
    typography: {
      fontFamily: "Nunito",
      button: {
        fontWeight: 700,
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={frLocale}>
        <MobileDatePicker
          clearable
          views={["day"]}
          showToolbar={false}
          disablePast
          value={value}
          renderInput={(params) => {
            return (
              <div
                className={cl(
                  "rounded-full h-10 flex items-center col-span-1 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 shadow-sm hover:shadow-md justify-center transition duration-300 cursor-pointer",
                  { "h-8 border-2 border-black/20": isSmall },
                  { "min-w-[35px]": isSmall && !date },
                  { "w-[70px]": isSmall && date },
                  { "max-w-[200px] px-[10px] gap-[5px]": date },
                  { "pointer-events-none border-none": props.disabled }
                )}
                {...props}
                {...params.inputProps}>
                <i className={"fas fa-calendar text-yellow-500"}></i>
                {date && (
                  <span
                    className={cl("font-bold", { "stext-lg": !isSmall }, { "text-sm": isSmall })}>
                    {formatDate(date)}
                  </span>
                )}
              </div>
            );
          }}
          onChange={setValue}
          onAccept={handleDateChange}
        />
        <PostponedSelectorDialog
          openDialog={openPostponedDialog}
          onSelectPostponedBy={onSelectPostponedBy}
          onClose={closePostponedDialog}></PostponedSelectorDialog>
      </LocalizationProvider>
    </ThemeProvider>
  );
};
