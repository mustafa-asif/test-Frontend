import { Autocomplete, Chip, Input, TextField } from "@mui/material";
import { useStoreActions, useStoreState } from "easy-peasy";
import { useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { useTranslation } from "../../i18n/provider";
import { xFetch } from "../../utils/constants";
import { Button } from "../shared/Button";
import { Card } from "../shared/Card";
import { Label } from "../shared/Label";

export const CitySettings = () => {
  const { loading, cities, inited } = useStoreState(state => state.cities);
  const { setCities, setInited } = useStoreActions(actions => actions.cities);
  const [fields, setFields] = useState({
    cities: cities.map(city => ({ _id: city._id, name: city.name })),
  });

  const [isLoading, setLoading] = useState(false);
  const showToast = useToast();
  const tl = useTranslation();

  async function fetchCities() {
    const { data, error } = await xFetch("/cities");
    setCities({ loading: false });
    if (error) return showToast(error, "error");
    setCities({ cities: data });
    setFields({ cities: data.map(city => ({ _id: city._id, name: city.name })) });
  }

  async function saveChanges() {
    if (isLoading) return;
    setLoading(true);
    const { data, error } = await xFetch(`/cities`, { method: "PATCH", body: fields });
    setLoading(false);
    if (error) return showToast(error, "error");
    showToast("Success", "success");
  }

  useEffect(() => {
    if (!inited) {
      setInited();
      fetchCities();
    }
  }, []);

  return (
    <Card loading={loading || isLoading}>
      <div className="flex flex-col gap-y-3">
        <div>
          <Label text={tl("cities")} />
          <Autocomplete
            options={[]}
            value={fields.cities}
            onChange={(e, val) => {
              setFields({
                cities: val.map(city => {
                  if (typeof city === "object") return city;
                  if (typeof city === "string") return { name: city };
                  else throw new Error(`wtf is this value: ${typeof val}`);
                }),
              });
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => <Chip variant="outlined" label={option.name} {...getTagProps({ index })} />)
            }
            renderInput={params => <TextField {...params} variant="outlined" label="Cities" placeholder="Add City" />}
            freeSolo
            multiple
          />
        </div>

        <Button label={tl("save_changes")} btnColor="secondary" onClick={saveChanges} disabled={isLoading || loading} />
      </div>
    </Card>
  );
};
