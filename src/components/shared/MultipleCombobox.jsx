import { Autocomplete, TextField } from "@mui/material";

export const MultipleCombobox = ({ placeholder, onValueChange, ...props }) => {
  return (
    <Autocomplete
      multiple
      filterSelectedOptions
      renderInput={(params) => (
        <TextField {...params} variant="standard" placeholder={placeholder} />
      )}
      onChange={(e, value) => {
        onValueChange?.(value);
      }}
      {...props}
    />
  );
};
