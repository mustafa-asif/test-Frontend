import { Fragment, useEffect, useState } from "react";
import { xFetch } from "../../utils/constants";
import { MenuItem, Select } from "@mui/material";
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} componentsProps={{ tooltip: { className: className } }} />
))(`
    color: #ffffff;
    background-color: rgba(31, 41, 55, 0.87);
    font-size: 1rem;
    font-weight: bold;
    font-family: nunito, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial;
`);

export const Profit = ({ ...props }) => {
  const [isLoading, setLoading] = useState(true);
  const [currentCycle, setCurrentCycle] = useState(null);
  const [minimumPayout, setMinimumPayout] = useState(100);

  async function getCurrentCycle() {
    const { data, error } = await xFetch(`/cycles`, undefined, undefined, undefined, [
      `status=active`,
      `_limit=1`,
    ]);
    setLoading(false);
    if (error) return console.error(error);
    setCurrentCycle(data[0] || { total: 0, bonus: 0 });
  }

  const handleChange = (event) => {
    setMinimumPayout(event.target.value);
  };

  useEffect(() => {
    getCurrentCycle();
  }, []);

  const cycleTotal = (currentCycle?.total ?? 0) + (currentCycle?.pending ?? 0);

  return (
    <Fragment>
      <div className="relative p-4 bg-white shadow-lg hover:shadow-xl transition duration-300 rounded-full z-10 text-2xl font-bold uppercase flex items-center justify-center h-12">
        <i className="fas fa-wallet pr-2 text-gray-500"></i>{" "}
        <span className="mr-2">livré non payé</span>
        {isLoading ? (
          <div className="h-6 w-32 bg-gray-200 rounded-full animate-pulse"></div>
        ) : (
          <span className="text-green-500">{cycleTotal > 0 ? cycleTotal.toFixed(2) : "0.0"}</span>
        )}
        <span className="font-semibold text-xs ml-1 mt-1">{"DH"}</span>
        {/* <div className="absolute right-3 text-xs">
          <StyledTooltip
            title="Paiement minimum"
            placement="top">
            <span>
              <Select
                disableUnderline
                variant="standard"
                value={minimumPayout}
                onChange={handleChange}
                label="Paiement minimum"
              >
                <MenuItem value={100}>
                  <span className="text-gray-500 font-bold">{"100"}</span>
                  <span className="text-xs ml-1">{"DH"}</span>
                </MenuItem>
                <MenuItem value={1000}>
                  <span className="text-gray-500 font-bold">{"1k"}</span>
                  <span className="text-xs ml-1">{"DH"}</span>
                </MenuItem>
                <MenuItem value={5000}>
                  <span className="text-gray-500 font-bold">{"5k"}</span>
                  <span className="text-xs ml-1">{"DH"}</span>
                </MenuItem>
                <MenuItem value={10000}>
                  <span className="text-gray-500 font-bold">{"10k"}</span>
                  <span className="text-xs ml-1">{"DH"}</span>
                </MenuItem>
                <MenuItem value={50000}>
                  <span className="text-gray-500 font-bold">{"50k"}</span>
                  <span className="text-xs ml-1">{"DH"}</span>
                </MenuItem>
                <MenuItem value={100000}>
                  <span className="text-gray-500 font-bold">{"100k"}</span>
                  <span className="text-xs ml-1">{"DH"}</span>
                </MenuItem>
              </Select>
            </span>
          </StyledTooltip>
        </div> */}
      </div>
      {currentCycle?.bonus?.toFixed(2) > 0 && (
        <div className="p-4 bg-yellow-100 shadow-lg hover:shadow-xl transition duration-300 rounded-full z-10 text-2xl font-bold uppercase flex items-center justify-center h-12">
          <i className="fas fa-gift pr-2 text-gray-500"></i>
          {isLoading ? (
            <div className="h-6 w-32 bg-gray-200 rounded-full animate-pulse"></div>
          ) : (
            <span className="text-green-500">{currentCycle?.bonus?.toFixed(2)}</span>
          )}
          <span className="font-semibold text-xs ml-1 mt-1">{"DH"}</span>
        </div>
      )}
    </Fragment>
  );
};
