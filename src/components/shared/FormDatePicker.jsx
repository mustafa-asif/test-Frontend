import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import frLocale from "date-fns/locale/fr";
import { useState } from "react";
import { cl } from "../../utils/misc";

export const FormDatePicker = ({ onValueChange, ...props }) => {
  const [open, setOpen] = useState(false);

  function handleChange(date) {
    if (date == "Invalid Date") return;
    onValueChange?.(formatDate(date));
  }

  function renderInput({ inputRef, inputProps, InputProps }) {
    const defaultClass = cl(
      "transition-colors duration-200 px-3 text-gray-700 cursor-default w-full bg-white border rounded-full outline-none border-gray-400 focus:outline-none focus:border-green-500 focus:shadow-md hover:bg-gray-50 focus:bg-gray-50 cursor-default ",
      { "bg-gray-100 pointer-events-none": props.disabled }
    );

    const defaultStyle = { height: 46 };

    return (
      <div className="relative flex items-center">
        <input
          className={defaultClass}
          style={{ ...defaultStyle }}
          ref={inputRef}
          placeholder={"dd/mm/yyyy"}
          value={props.value}
          readOnly
          onClick={() => setOpen(true)}
        />
        <div className="absolute top-1 bottom-1 flex items-center right-4 gap-x-1">
          {props.value && (
            <div
              className="cursor-pointer h-full px-3  hover:bg-gray-100 border-l border-r flex items-center"
              onClick={() => onValueChange("")}>
              <i className="fas fa-times text-red-500"></i>
            </div>
          )}
          {InputProps?.endAdornment}
        </div>
      </div>
    );
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
        <DesktopDatePicker
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          renderInput={renderInput}
          views={["day"]}
          disablePast
          onChange={handleChange}
          {...props}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
};

function formatDate(date) {
  date = new Date(date);
  if (date == "Invalid Date") return "";
  let month = "" + (date.getMonth() + 1);
  let day = "" + date.getDate();
  let year = "" + date.getFullYear();

  if (day.length === 1) day = "0" + day;
  if (month.length === 1) month = "0" + month;

  const result = [day, month, year];

  return result.join("/");
}
