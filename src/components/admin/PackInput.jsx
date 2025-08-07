import { AsyncAutocompleteInput } from "../shared/Input";

export const PackInput = ({ ...props }) => {
  return (
    <AsyncAutocompleteInput
      source_url="/fees/active-packs"
      inputProps={{ placeholder: "Pack" }}
      {...props}
    />
  );
};
