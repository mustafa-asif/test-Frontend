import { useStoreState } from "easy-peasy";
import { useEffect, useState } from "react";
import { Card } from "../shared/Card";
import lodash from "lodash";
import { xFetch } from "../../utils/constants";
import { useToast } from "../../hooks/useToast";
import { Button } from "../shared/Button";
import { Label } from "../shared/Label";
import { getDifferences } from "../../utils/misc";
import { useTranslation } from "../../i18n/provider";
import { PackagingList } from "./PackagingList";

export const SettingsCard = ({ ...props }) => {
  const user = useStoreState((state) => state.auth.user);
  const showToast = useToast();
  const tl = useTranslation();
  const [isLoading, setLoading] = useState(true);
  const [warehouse, setWarehouse] = useState(null);
  const [fields, setFields] = useState({ fees: {} });

  async function fetchInfo() {
    setWarehouse(null);
    setLoading(true);
    const { data, error } = await xFetch(`/users/${user._id}`, undefined, undefined, undefined, [
      `_show=warehouse.fees warehouse.working_cities warehouse.city warehouse.options.pickups`,
    ]);
    setLoading(false);
    if (error) return showToast(error, "error");
    setWarehouse(data.warehouse);
    setFields({
      fees: {
        deliverer: data.warehouse.fees.deliverer,
        warehouse: { packaging: data.warehouse.fees.warehouse.packaging },
      },
    });
  }
  useEffect(() => {
    fetchInfo();
  }, []);

  async function handleSave(e) {
    if (isLoading || !warehouse) return;
    const changes = getDifferences(warehouse, fields);
    console.log(changes);
    if (Object.keys(changes).length < 1) return;
    setLoading(true);
    const { data, error } = await xFetch(`/users/${user._id}`, {
      method: "PATCH",
      body: { warehouse: changes },
    });
    setLoading(false);
    if (error) return showToast(error, "error");
    showToast("Success", "success");
  }

  return (
    <Card>
      <div className="flex flex-col gap-y-2">
        <h1>{tl("settings")}</h1>
        <table className="col-span-4 rounded-t-lg m-5 w-full mx-auto bg-gray-200 text-gray-800">
          <tbody>
            <tr className="text-left border-b-2 border-gray-300">
              <th className="px-4 py-3">{tl("city")}</th>
              <th className="px-4 py-3">{tl("order_fee")}</th>
              <th className="px-4 py-3">{tl("pickup_fee")}</th>
              <th className="px-4 py-3">{tl("refusal_fee")}</th>
            </tr>
            {warehouse && fields.fees.deliverer ? (
              warehouse.working_cities.map((city) => (
                <tr className="bg-gray-100 border-b border-gray-200" key={city}>
                  <td className="px-4 py-3 capitalize">
                    {city} {city === warehouse.city && "(" + tl("main") + ")"}
                  </td>
                  <td className="px-4 py-3">
                    <FeesCell
                      warehouse_fee={findFee(warehouse.fees.warehouse.order, city)}
                      deliverer_fees={fields.fees.deliverer.order}
                      setFields={setFields}
                      model="order"
                      city={city}
                      disabled={isLoading}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <FeesCell
                      warehouse_fee={findFee(warehouse.fees.warehouse.pickup, city)}
                      deliverer_fees={fields.fees.deliverer.pickup}
                      setFields={setFields}
                      model="pickup"
                      city={city}
                      disabled={isLoading}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <FeesCell
                      warehouse_fee={findFee(warehouse.fees.warehouse.refusal, city)}
                      deliverer_fees={fields.fees.deliverer.refusal}
                      setFields={setFields}
                      model="refusal"
                      city={city}
                      disabled={isLoading}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr className="bg-gray-100 border-b border-gray-200">
                <td colSpan={4} className="text-center">
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {warehouse && warehouse.options.pickups && fields.fees.warehouse?.packaging && (
          <PackagingList
            disabled={isLoading}
            packaging={fields.fees.warehouse.packaging}
            onChange={(packaging) =>
              setFields({
                ...fields,
                fees: { ...fields.fees, warehouse: { ...fields.fees.warehouse, packaging } },
              })
            }
          />
        )}
        <div className="col-span-4 mb-10">
          <Button
            onClick={handleSave}
            label={tl("save_changes")}
            btnColor="secondary"
            disabled={!warehouse}
            isLoading={isLoading}
          />
        </div>
      </div>
    </Card>
  );
};
function findFee(fees, city) {
  const index = fees.cities.findIndex((fee) => fee.city === city);
  if (index === -1) return 0; // fees._default ??
  return fees.cities[index].fee;
}

function FeesCell({ warehouse_fee, deliverer_fees, model, city, setFields, ...rest }) {
  const tl = useTranslation();
  function handleDelivererFeeChange(e) {
    if (!e.target.validity.valid && !!e.target.value) return;
    setFields((fields) => {
      let updatedFields = lodash.cloneDeep(fields);
      const index = fields.fees.deliverer[model].cities.findIndex((fee) => fee.city === city);
      if (index === -1) {
        updatedFields.fees.deliverer[model].cities.push({ city, fee: e.target.value });
      } else {
        updatedFields.fees.deliverer[model].cities[index].fee = e.target.value;
      }

      return updatedFields;
    });
  }
  return (
    <table>
      <tbody>
        <tr>
          <td className="">{tl("warehouse")}:</td>
          <td className="px-2 py-1">
            <input
              role="presentation"
              autoComplete="off"
              id="fee"
              type="tel"
              pattern="[0-9]*"
              placeholder="0"
              defaultValue={warehouse_fee}
              className="border-0 px-3 w-16 placeholder-gray-300 text-gray-600 bg-gray-200 rounded-full text-lg font-bold shadow outline-none cursor-default"
              readOnly
              disabled
            />
          </td>
        </tr>
        <tr>
          <td>{tl("deliverer")}:</td>
          <td className="px-2 py-1">
            <input
              role="presentation"
              autoComplete="off"
              id="fee"
              type="tel"
              pattern="[0-9]*"
              placeholder="0"
              value={findFee(deliverer_fees, city)}
              onChange={handleDelivererFeeChange}
              className="border-0 px-3 w-16 placeholder-gray-300 text-gray-600 bg-white rounded-full text-lg font-bold shadow hover:shadow-md transition-shadow duration-200 outline-none"
              {...rest}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
}
